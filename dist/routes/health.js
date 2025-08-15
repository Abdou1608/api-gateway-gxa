"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
async function routes(app) {
    app.get('/health', async () => ({ status: 'ok' }));
    app.get('/readiness', async () => ({ ready: true }));
}
