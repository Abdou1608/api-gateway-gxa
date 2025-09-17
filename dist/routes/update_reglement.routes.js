"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Routes pour la fonctionnalité : Update Reglement
const express_1 = require("express");
const router = (0, express_1.Router)();
router.put('/', async (req, res) => {
    try {
        //const response = req.body;
        // res.json(response);
        throw new Error("Fonction Non Disponible");
    }
    catch (error) {
        res.status(error.status ?? 500).json({ error: error?.message, detail: JSON.stringify(error) });
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
