"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_liste_des_quittancesValidator = void 0;
const zod_1 = require("zod");
const basSecurityContext_query_1 = require("./basSecurityContext.query");
exports.api_liste_des_quittancesValidator = zod_1.z.object({
    contrat: zod_1.z.any().optional().describe("Champ contrat est requis, veuillez fournir le numero du contrat"),
    dossier: zod_1.z.any().optional(),
    BasSecurityContext: basSecurityContext_query_1.BasSecurityContextQuerySchema,
    domain: zod_1.z.string().optional(),
});
