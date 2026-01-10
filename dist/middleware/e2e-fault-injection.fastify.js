"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerE2eFaultInjection = registerE2eFaultInjection;
function normalizeHeaderValue(v) {
    if (Array.isArray(v))
        return String(v[0] ?? '').trim();
    return String(v ?? '').trim();
}
function getPathname(req) {
    const raw = (req.url ?? '').split('?')[0];
    return raw || '/';
}
/**
 * E2E-only fault injection.
 *
 * Enabled only when `E2E_FAULT_INJECTION=1`.
 * When enabled, setting header `x-e2e-fault: 500` on certain routes will force a 500 response.
 */
function registerE2eFaultInjection(app) {
    if (process.env.E2E_FAULT_INJECTION !== '1')
        return;
    app.addHook('preHandler', async (req, reply) => {
        const fault = normalizeHeaderValue(req.headers['x-e2e-fault']);
        if (!fault)
            return;
        const status = Number(fault);
        if (!Number.isFinite(status) || status < 400 || status > 599)
            return;
        const pathname = getPathname(req);
        // Keep the scope tight: only inject on endpoints used by the contract-creation wizard.
        const injectable = new Set([
            '/api/create_contrat',
            '/api/risk/risk_update',
            '/api/Cont_clause_create',
            '/api/Cont_garan_create',
        ]);
        if (!injectable.has(pathname))
            return;
        reply
            .code(status)
            .header('Cache-Control', 'no-store')
            .send({
            error: 'E2E injected fault',
            status,
            pathname,
            method: req.method,
        });
    });
}
