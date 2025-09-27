"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const closesession__service_1 = require("../services/logout/closesession_.service");
const api_logoutValidator_1 = require("../validators/api_logoutValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_logoutValidator_1.api_logoutValidator), async (req, res, next) => {
    try {
        const result = await (0, closesession__service_1.closesession_)(req.body);
        res.json(result);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
