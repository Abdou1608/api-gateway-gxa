"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const opensession_1 = require("../services/login/opensession");
const api_loginValidator_1 = require("../validators/api_loginValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const auth_service_1 = __importDefault(require("../auth/auth.service"));
const env_1 = __importDefault(require("../config/env"));
const router = (0, express_1.Router)();
const authService = new auth_service_1.default({ defaultTtlSeconds: 1800 });
router.post('/', (0, zodValidator_1.validateBody)(api_loginValidator_1.api_loginValidator), async (req, res) => {
    const logon = req.body?.login ?? req.body?.username;
    const password = req.body?.password;
    const domain = req.body?.domain;
    console.log('[login] incoming auth request', { user: logon, domain });
    if (logon && password && domain) {
        try {
            const result = await (0, opensession_1.opensession)(logon, password, domain);
            const anyResult = result;
            const SID = (anyResult?.SessionId ?? anyResult?._SessionId);
            if (!SID) {
                console.error('[login] Missing SessionID in upstream result');
                return res.status(503).json({ error: 'Missing SessionID from upstream' });
            }
            const key = env_1.default.jwtSecret ?? '';
            if (!key) {
                console.error('[login] Missing JWS_KEY env');
                return res.status(503).json({ error: 'Server misconfiguration: JWS_KEY is missing' });
            }
            const token = await authService.get_token(key, SID);
            try {
                if (req.session) {
                    req.session.bearer = token;
                }
            }
            catch (e) {
                console.warn('[login] Session not available to store bearer token');
            }
            res.set('Authorization', `Bearer ${token}`);
            return res.json({ ...(anyResult || {}), token });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('[login] Error:', message);
            return res.status(503).json({ error: message });
        }
    }
    else {
        return res.status(501).json({ error: 'Données manquantes ou non conforme' });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
