"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checksession__service_1 = require("../services/check_session/checksession_.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const async_handler_1 = require("../middleware/async-handler");
const router = (0, express_1.Router)();
router.post('/', (0, async_handler_1.asyncHandler)(async (req, res) => {
    const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    const result = await (0, checksession__service_1.checksession_)(_BasSecurityContext);
    res.json(result);
}));
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
