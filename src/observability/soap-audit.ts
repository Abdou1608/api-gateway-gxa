import { promises as fs } from 'fs';
import * as fssync from 'fs';
import * as path from 'path';
import * as readline from 'readline';

export interface SoapAuditEntry {
  id: number;           // pending queue id if available
  action: string;
  owner?: string;
  domain?: string;
  start: number;        // ms epoch
  end?: number;         // ms epoch
  durationMs?: number;
  outcome: 'success' | 'error';
  httpStatus?: number;  // mapped status if known
  errorCode?: string;   // normalized code if fault
  errorMessage?: string;
  payloadSnippet?: string; // truncated safe snippet of payload (success)
  errorSnippet?: string;   // truncated safe snippet of error or fault
}

const MAX_IN_MEMORY = 2000;
const LOG_DIR = process.env.SOAP_AUDIT_DIR || path.resolve(process.cwd(), 'logs');
const LOG_FILE = process.env.SOAP_AUDIT_FILE || path.join(LOG_DIR, 'soap-audit.log');

class SoapAuditRegistry {
  private entries: SoapAuditEntry[] = [];

  async init() {
    try { await fs.mkdir(LOG_DIR, { recursive: true }); } catch { /* ignore */ }
  }

  record(entry: SoapAuditEntry) {
    // push to memory
    this.entries.push(entry);
    if (this.entries.length > MAX_IN_MEMORY) this.entries.splice(0, this.entries.length - MAX_IN_MEMORY);
    // append to file (JSONL)
    const line = JSON.stringify(entry) + '\n';
    fs.appendFile(LOG_FILE, line).catch(() => {/* ignore file errors in hot path */});
  }

  snapshot(limit = 200): SoapAuditEntry[] {
    const n = Math.max(1, Math.min(limit, MAX_IN_MEMORY));
    return this.entries.slice(-n);
  }

  async clear(): Promise<void> {
    this.entries = [];
    try { await fs.writeFile(LOG_FILE, ''); } catch { /* ignore */ }
  }

  logPath(): string { return LOG_FILE; }
}

// --- File-backed querying and lightweight index ---

export interface AuditQueryOptions {
  limit?: number; // default 500
  action?: string;
  owner?: string;
  outcome?: 'success' | 'error' | '';
  since?: number; // epoch ms
  until?: number; // epoch ms
  sortBy?: 'start' | 'duration';
  order?: 'asc' | 'desc';
  cursor?: { start: number; id: number } | null; // pagination anchor; only guaranteed for sortBy=start
  useIndex?: boolean;
}

interface AuditQueryResult { items: SoapAuditEntry[]; nextCursor?: { start: number; id: number } | null }

const INDEX_FILE = LOG_FILE + '.index.jsonl';
const INDEX_META = LOG_FILE + '.index.meta.json';

async function readJsonL<T=any>(filePath: string, onLine: (obj: T, raw: string, offset: number) => boolean | void, startOffset = 0): Promise<number> {
  if (!fssync.existsSync(filePath)) return startOffset;
  const stream = fssync.createReadStream(filePath, { encoding: 'utf8', start: startOffset });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let offset = startOffset;
  for await (const line of rl) {
    const raw = line.trim();
    if (!raw) { offset += line.length + 1; continue; }
    try {
      const obj = JSON.parse(raw) as T;
      const stop = onLine(obj, raw, offset) === false;
      // length recomputed from raw; add newline char count (assuming \n)
      offset += Buffer.byteLength(line) + 1; // safe approximation
      if (stop) break;
    } catch {
      offset += Buffer.byteLength(line) + 1;
      continue;
    }
  }
  return offset;
}

async function getIndexMeta(): Promise<{ lastOffset: number }>{
  try { const txt = await fs.readFile(INDEX_META, 'utf8'); return JSON.parse(txt); } catch { return { lastOffset: 0 }; }
}

async function setIndexMeta(meta: { lastOffset: number }){ await fs.writeFile(INDEX_META, JSON.stringify(meta)); }

async function appendToIndexFrom(offsetStart = 0): Promise<number> {
  // Append index entries starting from offsetStart, computing offsets incrementally.
  let currentOffset = offsetStart;
  const indexStream = fssync.createWriteStream(INDEX_FILE, { flags: 'a' });
  await readJsonL<SoapAuditEntry>(LOG_FILE, (obj, _raw, off) => {
    const len = Buffer.byteLength(JSON.stringify(obj)) + 1;
    const line = JSON.stringify({ start: obj.start, id: obj.id, offset: off, length: len }) + '\n';
    indexStream.write(line);
    currentOffset = off + len;
  }, offsetStart);
  await new Promise(resolve => indexStream.end(resolve));
  return currentOffset;
}

async function rebuildIndex(): Promise<void> {
  try { await fs.unlink(INDEX_FILE); } catch {}
  const lastOffset = await appendToIndexFrom(0);
  await setIndexMeta({ lastOffset });
}

async function ensureIndexUpToDate(): Promise<void> {
  const meta = await getIndexMeta();
  const stat = await fs.stat(LOG_FILE).catch(()=>null as any);
  if (!stat) return;
  if (!fssync.existsSync(INDEX_FILE) || meta.lastOffset === 0) {
    await rebuildIndex();
    return;
  }
  if (meta.lastOffset < stat.size) {
    const lastOffset = await appendToIndexFrom(meta.lastOffset);
    await setIndexMeta({ lastOffset });
  }
}

async function findStartOffsetFromIndex(since?: number, tailCount?: number): Promise<number> {
  if (!fssync.existsSync(INDEX_FILE)) return 0;
  let startOffset = 0;
  if (typeof since === 'number') {
    // linear scan over index to find first offset with start >= since (index is chronological)
    await readJsonL<{ start:number; id:number; offset:number; length:number }>(INDEX_FILE, (obj) => {
      if (obj.start >= since) {
        startOffset = obj.offset; return false;
      }
      return true;
    }, 0);
  } else if (typeof tailCount === 'number' && tailCount > 0) {
    // get offset of the K-th entry from the end using ring buffer
    const ring: { offset:number }[] = [];
    await readJsonL<{ offset:number }>(INDEX_FILE, (obj) => {
      ring.push({ offset: obj.offset });
      if (ring.length > tailCount) ring.shift();
    }, 0);
    startOffset = ring.length ? ring[0].offset : 0;
  }
  return startOffset;
}

async function queryFile(opts: AuditQueryOptions = {}): Promise<AuditQueryResult> {
  const limit = Math.max(1, Math.min(2000, opts.limit ?? 500));
  const actionQ = (opts.action || '').toLowerCase();
  const ownerQ = (opts.owner || '').toLowerCase();
  const outcomeQ = (opts.outcome || '') as '' | 'success' | 'error';
  const since = typeof opts.since === 'number' ? opts.since : undefined;
  const until = typeof opts.until === 'number' ? opts.until : undefined;
  const sortBy = (opts.sortBy || 'start') as 'start' | 'duration';
  const order = (opts.order || 'desc') as 'asc' | 'desc';
  const cursor = opts.cursor || null;
  const useIndex = !!opts.useIndex;

  // Attempt to position read near start using the index if requested
  let startOffset = 0;
  if (useIndex) {
    try {
      await ensureIndexUpToDate();
      if (order === 'desc' && !cursor && !since) {
        startOffset = await findStartOffsetFromIndex(undefined, limit * 3);
      } else if (since) {
        startOffset = await findStartOffsetFromIndex(since, undefined);
      }
    } catch {}
  }

  let collected: SoapAuditEntry[] = [];
  let matchedCount = 0;
  const ringBuffer: SoapAuditEntry[] = []; // used for order=desc with no cursor

  const include = (e: SoapAuditEntry) => {
    if (actionQ && !(e.action||'').toLowerCase().includes(actionQ)) return false;
    if (ownerQ && !(e.owner||'').toLowerCase().includes(ownerQ)) return false;
    if (outcomeQ && e.outcome !== outcomeQ) return false;
    if (typeof since === 'number' && (e.start||0) < since) return false;
    if (typeof until === 'number' && (e.start||0) > until) return false;
    if (sortBy === 'start' && cursor) {
      // cursor applies on start ordering
      const cmp = (a: SoapAuditEntry, b: { start:number; id:number }) => (a.start - b.start) || ((a.id||0) - (b.id||0));
      if (order === 'desc') { if (!(cmp(e, cursor) < 0)) return false; }
      if (order === 'asc') { if (!(cmp(e, cursor) > 0)) return false; }
    }
    return true;
  };

  const earlyStop = (e: SoapAuditEntry): boolean => {
    if (sortBy !== 'start') return false;
    if (typeof until === 'number' && (e.start||0) > until) return true; // past time window (ascending file)
    return false;
  };

  const stat = await fs.stat(LOG_FILE).catch(()=>null as any);
  const size = stat?.size ?? 0;

  const processFromOffset = async (offset: number) => {
    collected = [];
    matchedCount = 0;
    ringBuffer.length = 0;
    await readJsonL<SoapAuditEntry>(LOG_FILE, (obj) => {
      const e = obj;
      if (earlyStop(e)) return false; // stop streaming early when beyond 'until'
      if (!include(e)) return true;
      matchedCount++;
      if (sortBy === 'start') {
        if (order === 'asc') {
          collected.push(e);
          if (collected.length >= limit) return false; // got page
        } else {
          if (!cursor) {
            ringBuffer.push(e);
            if (ringBuffer.length > limit) ringBuffer.shift();
          } else {
            collected.push(e); // older than cursor
          }
        }
      } else {
        // collect for duration sorting after stream
        collected.push(e);
      }
      if (sortBy === 'start' && order === 'desc' && cursor && collected.length >= limit) return false;
      return true;
    }, offset);
  };

  const shouldTailFirst = !useIndex && sortBy === 'start' && order === 'desc' && !cursor && !since && size > 0;
  if (shouldTailFirst) {
    const DEFAULT_WIN = 1024 * 1024; // 1MB
    const MAX_WIN = 16 * 1024 * 1024; // 16MB
    let win = DEFAULT_WIN;
    let offset = Math.max(0, size - win);
    await processFromOffset(offset);
    while ((ringBuffer.length < limit) && offset > 0 && win < MAX_WIN) {
      // expand window backwards
      win = Math.min(MAX_WIN, win * 2);
      offset = Math.max(0, size - win);
      await processFromOffset(offset);
      if (offset === 0) break;
    }
  } else {
    await processFromOffset(startOffset);
  }

  let items: SoapAuditEntry[];
  if (sortBy === 'start') {
    if (order === 'asc') {
      items = collected.slice(0, limit);
    } else {
      items = cursor ? collected.slice(-limit) : ringBuffer.slice();
      items.sort((a,b)=> (b.start - a.start) || ((b.id||0)-(a.id||0)) );
    }
  } else {
    // sort by duration and then apply order
    items = collected;
    items.sort((a,b)=> {
      const ad = a.durationMs ?? ((a.end ?? a.start) - a.start);
      const bd = b.durationMs ?? ((b.end ?? b.start) - b.start);
      return ad - bd;
    });
    if (order === 'desc') items.reverse();
    items = items.slice(0, limit);
  }

  // compute nextCursor (only reliable for sortBy=start)
  let nextCursor: { start:number; id:number } | null = null;
  if (sortBy === 'start' && items.length > 0) {
    if (order === 'desc') {
      // next page is older items, anchor at last (oldest) of current page
      const last = items[items.length - 1];
      nextCursor = { start: last.start, id: last.id };
    } else {
      // next page is newer, anchor at last (newest) of current page
      const last = items[items.length - 1];
      nextCursor = { start: last.start, id: last.id };
    }
  }

  return { items, nextCursor };
}

export const SoapAudit = Object.assign(new SoapAuditRegistry(), {
  queryFile,
  ensureIndexUpToDate,
  rebuildIndex,
});