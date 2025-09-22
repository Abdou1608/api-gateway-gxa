"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cont_search_service_1 = require("../services/liste_des_contrats/cont_search.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_liste_des_contratsValidator_1 = require("../validators/api_liste_des_contratsValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_liste_des_contratsValidator_1.api_liste_des_contratsValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.auth?.sid ?? req.body.BasSecurityContext?._SessionId;
        const reference = req.body.reference ?? "";
        const detailorigine = req.body.detailorigine;
        const origine = req.body.origine;
        const codefic = req.body.codefic ?? "";
        const nomchamp = req.body.nomchamp ?? "";
        const result = await (0, cont_search_service_1.cont_search)(reference, detailorigine, origine, codefic, nomchamp, _BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
