"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_liste_des_quittancesValidator = void 0;
const zod_1 = require("zod");
exports.api_liste_des_quittancesValidator = zod_1.z.object({
    contrat: zod_1.z.any().describe("Champ contrat est requis, veuillez fournir le numero du contrat"),
    dossier: zod_1.z.any().optional(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
