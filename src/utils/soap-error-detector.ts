import { XMLParser } from 'fast-xml-parser';

export interface SoapErrorLogEntry {
  message: string;
  code?: string;
  severity?: string;
  path?: string;
  context?: Record<string, unknown>;
}

export interface SoapDetectionResult {
  kind: 'log' | 'status' | 'data';
  message: string;
  code?: string;
  entries?: SoapErrorLogEntry[];
  rawSnippet?: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: true,
  parseTagValue: false,
  parseAttributeValue: false,
});

const ERROR_NODE_NAMES = new Set([
  'error',
  'errors',
  'fault',
  'faults',
  'exception',
  'exceptions',
  'erreur',
  'erreurs',
  'messageerreur',
  'errmessage',
  'errmsg',
]);

const MESSAGE_KEYS = ['message', 'msg', 'detail', 'libelle', 'motif', 'raison', 'description', 'texte', 'text'];
const SEVERITY_ATTRS = ['severity', 'level', 'type', 'typelog', 'loglevel', 'category'];
const STATUS_ATTRS = ['status', 'statut', 'flag', 'result', 'outcome'];
const CODE_ATTRS = ['code', 'errcode', 'errorcode', 'logcode', 'numero', 'num', 'id'];
const MESSAGE_ATTRS = ['message', 'msg', 'detail', 'libelle', 'motif', 'raison', 'description'];
const DATA_ERROR_PATTERNS = [
  /session(?:\s+\w+){0,4}\s+(?:non\s+valide|pas\s+valide|not\s+found)/i,
  /erreur/i,
  /error/i,
  /exception/i,
  /introuvable/i,
  /refus/i,
  /denied/i,
  /forbidden/i,
  /not\s+allowed/i,
  /invalid/i,
];

const DATA_PARSER = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: true,
  parseTagValue: false,
  parseAttributeValue: false,
});

interface TraverseState {
  severity?: string;
  status?: string;
  code?: string;
  forcedError?: boolean;
}

interface StatusCandidate {
  value: string;
  path: string;
  message?: string;
  context?: Record<string, unknown>;
  code?: string;
}

export function detectSoapError(xml: string): SoapDetectionResult | null {
  if (!xml || typeof xml !== 'string') {
    return null;
  }

  let parsed: any;
  try {
    parsed = parser.parse(xml);
  } catch {
    return null;
  }

  const envelope = findFirstByLocalName(parsed, 'Envelope');
  const body = envelope ? findFirstByLocalName(envelope, 'Body') : undefined;
  if (!body) {
    return null;
  }

  let actionResult = findFirstByLocalName(body, 'BasActionResult');
  if (!actionResult) {
    const runActionResponse = findFirstByLocalName(body, 'RunActionResponse');
    if (runActionResponse) {
      actionResult = findFirstByLocalName(runActionResponse, 'BasActionResult') ?? runActionResponse;
    }
  }
  if (!actionResult) {
    return null;
  }

  const logDetection = detectFromLogs(actionResult);
  if (logDetection) {
    return logDetection;
  }

  const statusDetection = detectFromStatus(actionResult);
  if (statusDetection) {
    return statusDetection;
  }

  const dataDetection = detectFromData(actionResult);
  if (dataDetection) {
    return dataDetection;
  }

  return null;
}

function detectFromLogs(node: unknown): SoapDetectionResult | null {
  const entries = dedupeEntries(collectLogEntries(node, []));
  if (!entries.length) {
    return null;
  }
  const message = entries.map((entry) => entry.message).filter(Boolean)[0] || 'Erreur metier SOAP';
  return {
    kind: 'log',
    code: entries.find((entry) => entry.code)?.code ?? 'SOAP.BUSINESS_LOG',
    message,
    entries,
    rawSnippet: undefined,
  };
}

function detectFromStatus(node: unknown): SoapDetectionResult | null {
  const statuses = collectStatusCandidates(node, []);
  const failing = statuses.find((status) => isErrorStatus(status.value));
  if (!failing) {
    return null;
  }
  const message = failing.message || `Statut en erreur: ${failing.value}`;
  return {
    kind: 'status',
    code: failing.code ?? 'SOAP.BUSINESS_STATUS',
    message,
    entries: [
      {
        message,
        severity: failing.value,
        code: failing.code,
        path: failing.path,
        context: failing.context,
      },
    ],
    rawSnippet: undefined,
  };
}

function detectFromData(node: any): SoapDetectionResult | null {
  const dataNode = findFirstByLocalName(node, 'Data');
  if (!dataNode) {
    return null;
  }
  const text = extractTextValue(dataNode);
  if (!text) {
    return null;
  }
  const decoded = decodeXmlEntities(text).trim();
  if (!decoded) {
    return null;
  }

  const entriesFromXml = parseEmbeddedErrorObjects(decoded);
  if (entriesFromXml.length) {
    const primary = entriesFromXml[0];
    return {
      kind: 'data',
      code: primary.code ?? 'SOAP.BUSINESS_DATA',
      message: primary.message,
      entries: entriesFromXml,
      rawSnippet: truncate(decoded, 600),
    };
  }

  if (!DATA_ERROR_PATTERNS.some((pattern) => pattern.test(decoded))) {
    return null;
  }

  const message = truncate(decoded, 300);
  return {
    kind: 'data',
    code: 'SOAP.BUSINESS_DATA',
    message,
    entries: [
      {
        message,
        severity: 'error',
        path: 'Data',
      },
    ],
    rawSnippet: truncate(decoded, 600),
  };
}

function collectLogEntries(node: unknown, path: string[], state: TraverseState = {}): SoapErrorLogEntry[] {
  if (node === null || node === undefined) {
    return [];
  }
  if (typeof node === 'string') {
    if (!state.forcedError) {
      return [];
    }
    const message = cleanMessage(node);
    if (!message) {
      return [];
    }
    return [
      {
        message,
        code: state.code,
        severity: state.severity,
        path: path.join('.'),
        context: state.status ? { status: state.status } : undefined,
      },
    ];
  }
  if (Array.isArray(node)) {
    return node.flatMap((child, index) => collectLogEntries(child, appendPath(path, String(index)), state));
  }
  if (typeof node !== 'object') {
    return [];
  }

  const attrs = extractAttributes(node);
  const parentCode = firstAttr(attrs, CODE_ATTRS);
  const severityAttr = firstAttr(attrs, SEVERITY_ATTRS) ?? state.severity;
  const statusAttr = firstAttr(attrs, STATUS_ATTRS) ?? state.status;
  const codeAttr = firstAttr(attrs, CODE_ATTRS) ?? state.code;
  const messageAttr = firstAttr(attrs, MESSAGE_ATTRS);

  const local = path[path.length - 1]?.toLowerCase();
  const forcedError = Boolean(
    state.forcedError ||
      isErrorSeverity(severityAttr) ||
      isErrorStatus(statusAttr) ||
      (local && ERROR_NODE_NAMES.has(local)) ||
      attrIndicatesError(attrs)
  );

  const entries: SoapErrorLogEntry[] = [];

  const messages: string[] = [];
  const textCandidate = typeof (node as any)['#text'] === 'string' ? (node as any)['#text'] : undefined;
  if (textCandidate) {
    messages.push(textCandidate);
  }
  if (messageAttr) {
    messages.push(messageAttr);
  }
  messages.push(...extractMessagesFromFields(node));
  messages.push(...extractMessagesFromParams(node));

  const cleanedMessages = dedupeStrings(messages.map(cleanMessage).filter(Boolean));
  if (forcedError && cleanedMessages.length) {
    entries.push({
      message: cleanedMessages[0],
      code: codeAttr,
      severity: severityAttr,
      path: path.join('.'),
      context: buildEntryContext(attrs, statusAttr, cleanedMessages.slice(1)),
    });
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === '#text' || key.startsWith('@_')) {
      continue;
    }
    const childPath = appendPath(path, localNameOf(key));
    entries.push(...collectLogEntries(value, childPath, { severity: severityAttr, status: statusAttr, code: codeAttr, forcedError }));
  }

  return entries;
}

function collectStatusCandidates(node: unknown, path: string[]): StatusCandidate[] {
  if (node === null || node === undefined) {
    return [];
  }
  if (typeof node === 'string') {
    return [];
  }
  if (Array.isArray(node)) {
    return node.flatMap((child, index) => collectStatusCandidates(child, appendPath(path, String(index))));
  }
  if (typeof node !== 'object') {
    return [];
  }

  const entries: StatusCandidate[] = [];
  const attrs = extractAttributes(node);
  const parentCode = firstAttr(attrs, CODE_ATTRS);

  for (const [key, value] of Object.entries(node)) {
    const local = localNameOf(key);
    const currentPath = appendPath(path, local);
    if (typeof value === 'string') {
      if (STATUS_ATTRS.includes(local.toLowerCase()) && value) {
        const message = findSiblingMessage(node, key);
        entries.push({
          value,
          path: currentPath.join('.'),
          message,
          context: buildEntryContext(attrs, undefined, []),
          code: parentCode,
        });
      }
      continue;
    }
    entries.push(...collectStatusCandidates(value, currentPath));
  }

  return entries;
}

function parseEmbeddedErrorObjects(decoded: string): SoapErrorLogEntry[] {
  if (!decoded.includes('<')) {
    return [];
  }
  let parsed: any;
  try {
    parsed = DATA_PARSER.parse(decoded);
  } catch {
    return [];
  }
  return dedupeEntries(collectEmbeddedErrors(parsed, []));
}

function collectEmbeddedErrors(node: unknown, path: string[]): SoapErrorLogEntry[] {
  if (node === null || node === undefined) {
    return [];
  }
  if (typeof node === 'string') {
    return [];
  }
  if (Array.isArray(node)) {
    return node.flatMap((child, index) => collectEmbeddedErrors(child, appendPath(path, String(index))));
  }
  if (typeof node !== 'object') {
    return [];
  }

  const attrs = extractAttributes(node);
  const typename = attrs.typename || attrs.type;
  const local = path[path.length - 1]?.toLowerCase();
  const isErrorObject = Boolean(
    (typename && typename.toLowerCase().includes('error')) ||
      (local && ERROR_NODE_NAMES.has(local))
  );

  const entries: SoapErrorLogEntry[] = [];
  if (isErrorObject) {
    const messages = extractMessagesFromParams(node).concat(extractMessagesFromFields(node));
    const message = cleanMessage(messages[0]);
    if (message) {
      entries.push({
        message,
        severity: attrs.severity,
        code: attrs.code,
        path: path.join('.'),
        context: buildEntryContext(attrs, attrs.status, messages.slice(1)),
      });
    }
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('@_')) {
      continue;
    }
    const childPath = appendPath(path, localNameOf(key));
    entries.push(...collectEmbeddedErrors(value, childPath));
  }

  return entries;
}

function extractMessagesFromFields(node: any): string[] {
  const messages: string[] = [];
  for (const key of MESSAGE_KEYS) {
    const value = node[key] ?? node[key.toUpperCase()] ?? node[capitalize(key)];
    if (typeof value === 'string') {
      messages.push(value);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string') {
          messages.push(item);
        }
      }
    }
  }
  return messages;
}

function extractMessagesFromParams(node: any): string[] {
  const messages: string[] = [];
  const params = toArray(node.param ?? node.Param ?? node.PARAM);
  for (const param of params) {
    if (!param) {
      continue;
    }
    const attrs = extractAttributes(param);
    const name = (attrs.name || attrs.nom || attrs.key || '').toLowerCase();
    const value = typeof param['#text'] === 'string' ? param['#text'] : undefined;
    const message = cleanMessage(value || firstAttr(attrs, MESSAGE_ATTRS));
    if (!message) {
      continue;
    }
    if (!name || ERROR_NODE_NAMES.has(name) || MESSAGE_KEYS.includes(name) || name.includes('motif') || name.includes('raison')) {
      messages.push(message);
    }
  }
  return messages;
}

function extractTextValue(node: any): string | undefined {
  if (node === null || node === undefined) {
    return undefined;
  }
  if (typeof node === 'string') {
    return node;
  }
  if (Array.isArray(node)) {
    for (const entry of node) {
      const text = extractTextValue(entry);
      if (text) {
        return text;
      }
    }
    return undefined;
  }
  if (typeof node !== 'object') {
    return undefined;
  }
  if (typeof node['#text'] === 'string') {
    return node['#text'];
  }
  if (typeof node._ === 'string') {
    return node._;
  }
  for (const value of Object.values(node)) {
    const text = extractTextValue(value as any);
    if (text) {
      return text;
    }
  }
  return undefined;
}

function findFirstByLocalName(node: any, name: string): any {
  if (node === null || node === undefined) {
    return undefined;
  }
  if (Array.isArray(node)) {
    for (const entry of node) {
      const found = findFirstByLocalName(entry, name);
      if (found !== undefined) {
        return found;
      }
    }
    return undefined;
  }
  if (typeof node !== 'object') {
    return undefined;
  }
  for (const [key, value] of Object.entries(node)) {
    if (localNameOf(key) === name) {
      return value;
    }
  }
  for (const value of Object.values(node)) {
    const found = findFirstByLocalName(value, name);
    if (found !== undefined) {
      return found;
    }
  }
  return undefined;
}

function extractAttributes(node: any): Record<string, string> {
  const result: Record<string, string> = {};
  if (!node || typeof node !== 'object') {
    return result;
  }
  for (const [key, value] of Object.entries(node)) {
    if (!key.startsWith('@_')) {
      continue;
    }
    if (value === null || value === undefined) {
      continue;
    }
    result[key.slice(2).toLowerCase()] = String(value);
  }
  return result;
}

function firstAttr(attrs: Record<string, string>, keys: string[]): string | undefined {
  for (const key of keys) {
    if (attrs[key]) {
      return attrs[key];
    }
  }
  return undefined;
}

function attrIndicatesError(attrs: Record<string, string>): boolean {
  const flag = firstAttr(attrs, STATUS_ATTRS);
  if (flag && isErrorStatus(flag)) {
    return true;
  }
  const severity = firstAttr(attrs, SEVERITY_ATTRS);
  if (severity && isErrorSeverity(severity)) {
    return true;
  }
  return false;
}

function isErrorSeverity(value?: string): boolean {
  if (!value) {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return (
    normalized.includes('error') ||
    normalized.includes('err') ||
    normalized.includes('fatal') ||
    normalized.includes('crit') ||
    normalized.includes('severe') ||
    normalized.includes('danger') ||
    normalized === 'ko' ||
    normalized === 'nok' ||
    normalized.includes('fail')
  );
}

function isErrorStatus(value?: string): boolean {
  if (!value) {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  if (normalized === 'ko' || normalized === 'nok') {
    return true;
  }
  if (normalized.startsWith('err') || normalized.includes('echec') || normalized.includes('refus')) {
    return true;
  }
  if (normalized.includes('non valide') || normalized.includes('not found') || normalized.includes('invalid')) {
    return true;
  }
  if (normalized.includes('denied') || normalized.includes('forbidden')) {
    return true;
  }
  if (normalized.includes('introuvable')) {
    return true;
  }
  return false;
}

function dedupeEntries(entries: SoapErrorLogEntry[]): SoapErrorLogEntry[] {
  const seen = new Map<string, SoapErrorLogEntry>();
  for (const entry of entries) {
    const key = [entry.path || '', entry.message, entry.code || '', entry.severity || ''].join('@@');
    if (!seen.has(key)) {
      seen.set(key, entry);
    }
  }
  return Array.from(seen.values());
}

function dedupeStrings(values: string[]): string[] {
  const seen = new Set<string>();
  for (const value of values) {
    seen.add(value);
  }
  return Array.from(seen.values());
}

function cleanMessage(value?: string): string {
  if (!value) {
    return '';
  }
  return value.replace(/\s+/g, ' ').trim();
}

function buildEntryContext(attrs: Record<string, string>, status?: string, extraMessages: string[] = []): Record<string, unknown> | undefined {
  const context: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    context[key] = value;
  }
  if (status) {
    context.status = status;
  }
  if (extraMessages.length) {
    context.extraMessages = extraMessages;
  }
  return Object.keys(context).length ? context : undefined;
}

function appendPath(path: string[], segment: string): string[] {
  return [...path, segment];
}

function localNameOf(key: string): string {
  const index = key.lastIndexOf(':');
  return index >= 0 ? key.slice(index + 1) : key;
}

function capitalize(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toArray<T>(input: T | T[] | undefined): T[] {
  if (input === undefined || input === null) {
    return [];
  }
  return Array.isArray(input) ? input : [input];
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function truncate(value: string, max = 200): string {
  if (value.length <= max) {
    return value;
  }
  const limit = Math.max(0, max - 3);
  return `${value.slice(0, limit)}...`;
}

function findSiblingMessage(node: any, excludeKey: string): string | undefined {
  if (!node || typeof node !== 'object') {
    return undefined;
  }
  for (const key of MESSAGE_KEYS) {
    for (const variant of [key, key.toUpperCase(), capitalize(key)]) {
      if (variant === excludeKey) {
        continue;
      }
      const value = node[variant];
      if (typeof value === 'string') {
        return cleanMessage(value);
      }
    }
  }
  return undefined;
}
