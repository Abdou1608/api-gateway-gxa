"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_update_piece_contratValidator = void 0;
const zod_1 = require("zod");
exports.api_update_piece_contratValidator = zod_1.z.object({
    contrat: zod_1.z.number(),
    produit: zod_1.z.string().min(1, "champ requis"),
    Effet: zod_1.z.preprocess(val => (typeof val === "string" || val instanceof Date) ? new Date(val) : val, zod_1.z.date()),
    défaut: zod_1.z.any(),
    modifier: zod_1.z.any(),
});
