"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const produit_listitems_service_1 = require("../services/liste_des_produits/produit_listitems.service");
const BasSecurityContext_1 = require("../Model/BasSoapObject/BasSecurityContext");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    const _BasSecurityContext = new BasSecurityContext_1.BasSecurityContext();
    _BasSecurityContext.IsAuthenticated = true;
    _BasSecurityContext.SessionId = req.body.BasSecurityContext._SessionId;
    const branche = req.body.branche ?? null;
    const entites = req.body.extentions ?? null;
    const typeecran = req.body.typeecran ?? null;
    const disponible = req.body.disponible ?? true;
    console.log("-----------------------------Données Reccus Route listedesproduits req.body.BasSecurityContext ==" + JSON.stringify(req.body.BasSecurityContext));
    try {
        const result = await (0, produit_listitems_service_1.produit_listitems)(typeecran, branche, disponible, _BasSecurityContext);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
