"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_update_service_1 = require("../services/update_contrat/cont_update.service");
const api_contrat_updateValidator_1 = require("../validators/api_contrat_updateValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_contrat_updateValidator_1.api_contrat_updateValidator), async (req, res) => {
    try {
        const result = await (0, cont_update_service_1.cont_update)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
