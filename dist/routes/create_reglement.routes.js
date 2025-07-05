"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kco_cashtransaction_service_1 = require("../services/create_reglement/kco_cashtransaction.service");
const router = (0, express_1.Router)();
router.post('/kco-cashtransaction', async (req, res) => {
    try {
        const result = await (0, kco_cashtransaction_service_1.kco_cashtransaction)(req.body, req.body.BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
