"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Routes pour la fonctionnalité : Update Reglement
const express_1 = require("express");
const errors_1 = require("../common/errors");
const router = (0, express_1.Router)();
router.put('/', async (req, res, next) => {
    try {
        //const response = req.body;
        // res.json(response);
        return next(new errors_1.InternalError('Fonction Non Disponible'));
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
