"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withUserQueue = withUserQueue;
exports.userQueueKey = userQueueKey;
const DEFAULT_CONCURRENCY = Number(process.env.USER_QUEUE_CONCURRENCY || '2') || 2;
// Minimal per-key concurrency limiter (FIFO) to avoid ESM-only deps in tests
function createLimiter(concurrency) {
    let active = 0;
    const queue = [];
    const next = () => {
        if (active >= concurrency)
            return;
        const run = queue.shift();
        if (!run)
            return;
        active++;
        run();
    };
    const limit = async (fn) => {
        return new Promise((resolve, reject) => {
            const exec = async () => {
                try {
                    const res = await fn();
                    resolve(res);
                }
                catch (e) {
                    reject(e);
                }
                finally {
                    active--;
                    next();
                }
            };
            queue.push(exec);
            setImmediate(next);
        });
    };
    return limit;
}
const limiters = new Map();
function keyOf(userSub, domain) {
    return `${userSub || 'anon'}::${domain || 'default'}`;
}
function withUserQueue(userSub, domain, task) {
    const key = keyOf(userSub, domain);
    let limiter = limiters.get(key);
    if (!limiter) {
        limiter = createLimiter(DEFAULT_CONCURRENCY);
        limiters.set(key, limiter);
    }
    return limiter(task);
}
function userQueueKey(userSub, domain) {
    return keyOf(userSub, domain);
}
