"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quietLog = quietLog;
exports.quietWarn = quietWarn;
exports.quietError = quietError;
function isQuiet(env = process.env) {
    return env.E2E_QUIET === '1' || env.LOG_QUIET === '1';
}
function quietLog(...args) {
    if (!isQuiet())
        console.log(...args);
}
function quietWarn(...args) {
    if (!isQuiet())
        console.warn(...args);
}
function quietError(...args) {
    if (!isQuiet())
        console.error(...args);
}
