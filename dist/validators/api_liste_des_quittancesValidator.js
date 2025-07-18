"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_liste_des_quittancesValidator = void 0;
const zod_1 = require("zod");
exports.api_liste_des_quittancesValidator = zod_1.z.object({
    contrat: zod_1.z.number().optional(),
});
