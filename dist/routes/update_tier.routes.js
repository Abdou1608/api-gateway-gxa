"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tiers_update_service_1 = require("../services/update_tier/tiers_update.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const router = (0, express_1.Router)();
router.put('/', async (req, res) => {
    const dossier = JSON.parse(req.body.dossier);
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        const numtiers = req.body.numtiers ?? null;
        const numdpp = req.body.numdpp ?? null;
        const data = req.body.data;
        const result = await (0, tiers_update_service_1.tiers_update)(dossier, data, _BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
