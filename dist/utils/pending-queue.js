"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendingQueue = void 0;
class PendingQueueRegistry {
    constructor() {
        this.seq = 0;
        this.pending = new Map();
    }
    register(action, ctx) {
        const id = ++this.seq;
        const info = {
            id,
            action,
            owner: ctx?.userId,
            domain: ctx?.domain,
            startedAt: Date.now(),
        };
        this.pending.set(id, info);
        return info;
    }
    complete(id) {
        const info = this.pending.get(id);
        if (info)
            this.pending.delete(id);
        return info;
    }
    snapshot() {
        return Array.from(this.pending.values()).sort((a, b) => a.startedAt - b.startedAt);
    }
    formatSnapshot(maxItems = 8) {
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
    size() { return this.pending.size; }
}
exports.PendingQueue = new PendingQueueRegistry();
