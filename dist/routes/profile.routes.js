"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const xtlog_search_service_1 = require("../services/profile/xtlog_search.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_profileValidator_1 = require("../validators/api_profileValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const async_handler_1 = require("../middleware/async-handler");
const token_revocation_service_1 = require("../auth/token-revocation.service");
const closesession__service_1 = require("../services/logout/closesession_.service");
const errors_1 = require("../common/errors");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_profileValidator_1.api_profileValidator), (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    // Bearer déjà validé et non révoqué par tokenRevocationPrecheck
    const authHeader = req.header('authorization');
    const bearer = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
    const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
    const username = req.body.login;
    const domain = req.body.domain;
    //console.log("-----------------------------Données Reccus dans profile Route req.body.BasSecurityContext =="+JSON.stringify( req.body.BasSecurityContext))
    const result = await (0, xtlog_search_service_1.xtlog_search)(_BasSecurityContext, username, domain, { userId: req.user?.sub, domain });
    const asAny = result;
    const empty = asAny == null || asAny === '' || (typeof asAny === 'object' && Object.keys(asAny).length === 0);
    if (empty) {
        if (bearer) {
            await (0, token_revocation_service_1.invalidateToken)(bearer);
        }
        if (_BasSecurityContext.SessionId) {
            try {
                await (0, closesession__service_1.closesession_)(_BasSecurityContext.SessionId);
            }
            catch { /* ignore */ }
        }
        return next(new errors_1.AuthError('Unauthorized', { reason: 'empty profile' }));
    }
    console.log("-----------------------------Données de profile Route renvoyer au CLIENT----------------------------------- ==" + JSON.stringify(result));
    console.warn("----------------------------------------------------------------");
    // console.log("-----------------------------Données de profile Route renvoyer au CLIENT sans JSON.stringify----------------------------------- =="+result)
    res.json(result);
}));
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
