"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const closesession__service_1 = require("../services/logout/closesession_.service");
const router = (0, express_1.Router)();
router.post('/closesession-', async (req, res) => {
    try {
        const result = await (0, closesession__service_1.closesession_)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
