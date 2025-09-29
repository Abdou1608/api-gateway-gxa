"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables early
dotenv_1.default.config();
function number(name, def) {
    const raw = process.env[name];
    if (!raw)
        return def;
    const n = Number(raw);
    return Number.isFinite(n) ? n : def;
}
const config = {
    port: number('PORT', 3000),
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    soapTimeoutMs: number('SOAP_TIMEOUT_MS', 15000),
    soapRetries: number('SOAP_RETRIES', 2),
    soapBackoffMs: number('SOAP_BACKOFF_MS', 400),
    userQueueConcurrency: number('USER_QUEUE_CONCURRENCY', 2),
};
exports.default = config;
