"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_create_contratValidator = void 0;
const zod_1 = require("zod");
exports.api_create_contratValidator = zod_1.z.object({
    dossier: zod_1.z.number(),
    produit: zod_1.z.string().min(1, "champ requis"),
    Effet: zod_1.z.preprocess(val => (typeof val === "string" || val instanceof Date) ? new Date(val) : val, zod_1.z.date()),
    défaut: zod_1.z.any(),
    pièce: zod_1.z.any(),
    data: zod_1.z.any(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
