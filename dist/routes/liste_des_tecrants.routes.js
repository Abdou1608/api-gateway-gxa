"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Bran_listitems_service_1 = require("../services/Bran_listitems.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const api_liste_des_bransValidator_1 = require("../validators/api_liste_des_bransValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.post('/', (0, zodValidator_1.validateBody)(api_liste_des_bransValidator_1.api_liste_des_bransValidator), async (req, res) => {
    try {
        const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
        _BasSecurityContext.IsAuthenticated = true;
        _BasSecurityContext.SessionId = req.body.BasSecurityContext?._SessionId;
        //console.log("-----------------------------Données Reccus Route listedesbrans req.body.BasSecurityContext =="+JSON.stringify( req.body.BasSecurityContext))
        const result = await (0, Bran_listitems_service_1.bran_listitems)(_BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
