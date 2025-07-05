"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const xtlog_search_service_1 = require("../services/profile/xtlog_search.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.body.BasSecurityContext._SessionId;
    const username = req.body.username ?? req.body.login;
    const domain = req.body.domain;
    console.log("-----------------------------Données Reccus dans profile Route req.body.BasSecurityContext ==" + JSON.stringify(req.body.BasSecurityContext));
    try {
        const result = await (0, xtlog_search_service_1.xtlog_search)(_BasSecurityContext, username, domain);
        console.log("-----------------------------Données de profile Route renvoyer au CLIENT----------------------------------- ==" + JSON.stringify(result));
        console.warn("----------------------------------------------------------------");
        console.log("-----------------------------Données de profile Route renvoyer au CLIENT sans JSON.stringify----------------------------------- ==" + result);
        res.json(result);
    }
    catch (error) {
        console.log("Erreur dans profile route ==" + JSON.stringify(error));
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
