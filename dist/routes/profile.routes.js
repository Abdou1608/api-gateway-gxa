"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const xtlog_search_service_1 = require("../services/profile/xtlog_search.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_profileValidator_1 = require("../validators/api_profileValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_profileValidator_1.api_profileValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        const username = req.body.login;
        const domain = req.body.domain;
        //console.log("-----------------------------Données Reccus dans profile Route req.body.BasSecurityContext =="+JSON.stringify( req.body.BasSecurityContext))
        const result = await (0, xtlog_search_service_1.xtlog_search)(_BasSecurityContext, username, domain);
        console.log("-----------------------------Données de profile Route renvoyer au CLIENT----------------------------------- ==" + JSON.stringify(result));
        console.warn("----------------------------------------------------------------");
        // console.log("-----------------------------Données de profile Route renvoyer au CLIENT sans JSON.stringify----------------------------------- =="+result)
        res.json(result);
    }
    catch (error) {
        console.log("Erreur dans profile route ==" + JSON.stringify(error));
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
