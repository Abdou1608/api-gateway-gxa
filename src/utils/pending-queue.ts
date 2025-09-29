type Ctx = { userId?: string; domain?: string; password?: string };

export interface PendingCallInfo {
  id: number;
  action: string;
  owner?: string;
  domain?: string;
  startedAt: number; // ms since epoch
}

class PendingQueueRegistry {
  private seq = 0;
  private pending = new Map<number, PendingCallInfo>();

  register(action: string, ctx?: Ctx): PendingCallInfo {
    const id = ++this.seq;
    const info: PendingCallInfo = {
      id,
      action,
      owner: ctx?.userId,
      domain: ctx?.domain,
      startedAt: Date.now(),
    };
    this.pending.set(id, info);
    return info;
  }

  complete(id: number): PendingCallInfo | undefined {
    const info = this.pending.get(id);
    if (info) this.pending.delete(id);
    return info;
  }

  snapshot(): PendingCallInfo[] {
    return Array.from(this.pending.values()).sort((a, b) => a.startedAt - b.startedAt);
  }

  formatSnapshot(maxItems = 8): string {
    const now = Date.now();
    const items = this.snapshot();
    const parts = items.slice(0, maxItems).map((p) => {
      const age = Math.max(0, now - p.startedAt);
      const s = (age / 1000).toFixed(2);
      const owner = p.owner ? ` by ${p.owner}` : '';
      const dom = p.domain ? `@${p.domain}` : '';
      return `#${p.id} ${p.action}${owner}${dom} (+${s}s)`;
    });
    const extra = items.length > maxItems ? ` …and ${items.length - maxItems} more` : '';
    return parts.join(', ') + extra;
  }

  size(): number { return this.pending.size; }
}

export const PendingQueue = new PendingQueueRegistry();
