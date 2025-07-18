"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_create_reglementValidator = void 0;
const zod_1 = require("zod");
exports.api_create_reglementValidator = zod_1.z.object({
    typeoperation: zod_1.z.string().min(1, "champ requis"),
    typeenc: zod_1.z.string().min(1, "champ requis"),
    targetkind: zod_1.z.string().min(1, "champ requis"),
    targetqintid: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    montant: zod_1.z.number(),
    devise: zod_1.z.string().min(1, "champ requis"),
    date: zod_1.z.preprocess(val => (typeof val === "string" || val instanceof Date) ? new Date(val) : val, zod_1.z.date()).optional(),
    défaut: zod_1.z.any(),
    dateff: zod_1.z.preprocess(val => (typeof val === "string" || val instanceof Date) ? new Date(val) : val, zod_1.z.date()).optional(),
    reference: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    tierspayeur: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
});
