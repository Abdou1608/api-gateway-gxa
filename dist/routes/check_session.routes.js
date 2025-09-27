"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checksession__service_1 = require("../services/check_session/checksession_.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_check_sessionValidator_1 = require("../validators/api_check_sessionValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_check_sessionValidator_1.api_check_sessionValidator), async (req, res, next) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
        const result = await (0, checksession__service_1.checksession_)(_BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
