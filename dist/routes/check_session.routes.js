"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checksession__service_1 = require("../services/check_session/checksession_.service");
const router = (0, express_1.Router)();
router.post('/checksession-', async (req, res) => {
    try {
        const result = await (0, checksession__service_1.checksession_)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
