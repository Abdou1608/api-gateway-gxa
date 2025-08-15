"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
const http_proxy_1 = __importDefault(require("@fastify/http-proxy"));
const jwt_1 = require("../auth/jwt");
async function routes(app) {
    await app.register(http_proxy_1.default, { upstream: app.config.BROKER_SERVICE_URL, prefix: '/api/brokers', rewritePrefix: '/' });
    app.addHook('onRequest', async (req, reply) => {
        const user = (0, jwt_1.verifyJwt)(req);
        if (!user)
            return reply.status(401).send({ message: 'Unauthorized' });
        req.user = user;
    });
}
