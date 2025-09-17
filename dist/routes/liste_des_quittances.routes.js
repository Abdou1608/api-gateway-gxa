"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quittance_listitems_service_1 = require("../services/liste_des_quittances/quittance_listitems.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_liste_des_quittancesValidator_1 = require("../validators/api_liste_des_quittancesValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_liste_des_quittancesValidator_1.api_liste_des_quittancesValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        const dossier = req.body.dossier;
        const contrat = req.body.contrat;
        //console.log("dossier==="+dossier)
        const result = await (0, quittance_listitems_service_1.quittance_listitems)(dossier, contrat, _BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
