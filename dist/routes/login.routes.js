"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const opensession_1 = require("../services/login/opensession");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    const logon = req.body.login ?? req.body.username;
    const password = req.body.password;
    const domain = req.body.domain;
    console.log("Valeur Resut dans l'aPI de opensesion==" + JSON.stringify(req.body));
    console.log("Valeur Resut dans l'aPI de opensesion pour username==" + logon);
    console.log("Valeur Resut dans l'aPI de opensesion pour password==" + password);
    if (logon && (password || domain)) {
        try {
            const result = await (0, opensession_1.opensession)(logon, password, domain);
            console.log("Valeur Resultat de opensesion==" + result);
            res.json(result);
        }
        catch (error) {
            console.log("Erreur dans API==" + error.message);
            res.status(500).json({ error: error.message });
        }
    }
    else {
        res.status(501).json({ error: "Données manquantes ou non conforme" });
    }
});
exports.default = router;
