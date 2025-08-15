"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
exports.default = (0, fastify_plugin_1.default)(async (app) => {
    app.setErrorHandler((err, _req, reply) => {
        app.log.error({ err }, 'Unhandled error');
        const status = err.statusCode ?? 500;
        reply.status(status).send({ message: err.message ?? 'Internal Server Error' });
    });
});
