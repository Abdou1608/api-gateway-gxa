"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_listitems_service_1 = require("../services/liste_des_contrats_d_un_tier/cont_listitems.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_liste_des_contrats_d_un_tierValidator_1 = require("../validators/api_liste_des_contrats_d_un_tierValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_liste_des_contrats_d_un_tierValidator_1.api_liste_des_contrats_d_un_tierValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        const dossier = req.body.dossier;
        const includeall = req.body.includeall ?? true;
        const defaut = req.body.defaut ?? false;
        const result = await (0, cont_listitems_service_1.cont_listitems)(dossier, includeall, defaut, _BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
