"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_liste_des_produitsValidator = void 0;
const zod_1 = require("zod");
exports.api_liste_des_produitsValidator = zod_1.z.object({
    typeecran: zod_1.z.string().optional(),
    branche: zod_1.z.string().optional(),
    cie: zod_1.z.number().optional(),
    entite: zod_1.z.number().optional(),
    disponible: zod_1.z.boolean().optional(),
});
