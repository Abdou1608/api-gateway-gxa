"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const compress_1 = __importDefault(require("@fastify/compress"));
exports.default = (0, fastify_plugin_1.default)(async (app) => {
    await app.register(cors_1.default, { origin: true, credentials: true });
    await app.register(helmet_1.default);
    await app.register(rate_limit_1.default, { max: 200, timeWindow: '1 minute' });
    await app.register(compress_1.default);
});
