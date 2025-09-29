"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withUserQueue = withUserQueue;
exports.userQueueKey = userQueueKey;
const p_limit_1 = __importDefault(require("p-limit"));
const DEFAULT_CONCURRENCY = Number(process.env.USER_QUEUE_CONCURRENCY || '2') || 2;
const limiters = new Map();
function keyOf(userSub, domain) {
    return `${userSub || 'anon'}::${domain || 'default'}`;
}
function withUserQueue(userSub, domain, task) {
    const key = keyOf(userSub, domain);
    let limiter = limiters.get(key);
    if (!limiter) {
        limiter = (0, p_limit_1.default)(DEFAULT_CONCURRENCY);
        limiters.set(key, limiter);
    }
    return limiter(task);
}
function userQueueKey(userSub, domain) {
    return keyOf(userSub, domain);
}
