"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Routes pour la fonctionnalité : Update pièce du contrat
const express_1 = require("express");
const cont_update_service_1 = require("../services/update_contrat/cont_update.service");
const api_update_piece_contratValidator_1 = require("../validators/api_update_piece_contratValidator");
const zodValidator_1 = require("../middleware/zodValidator");
const router = (0, express_1.Router)();
router.put('/', (0, zodValidator_1.validateBody)(api_update_piece_contratValidator_1.api_update_piece_contratValidator), async (req, res) => {
    try {
        const dossier = parseInt(req.body.dossier);
        const piece = req.body.piece;
        const data = req.body.data;
        const response = await (0, cont_update_service_1.cont_piece_update)(dossier, piece, data, req.body.BasSecurityContext ?? req.body.basSecurityContext);
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'SOAP request failed', details: error });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
