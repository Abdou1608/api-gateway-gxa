"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_detail_contratValidator = void 0;
const zod_1 = require("zod");
exports.api_detail_contratValidator = zod_1.z.object({
    contrat: zod_1.z.number(),
    Allpieces: zod_1.z.boolean().optional(),
    pieces: zod_1.z.any().optional(),
    DetailAdh: zod_1.z.boolean().optional(),
    RISA: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    RIMM: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    RVEH: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    RDIV: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    RDPP: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    Garanties: zod_1.z.boolean().optional(),
    Extensions: zod_1.z.boolean().optional(),
    infosCieProd: zod_1.z.boolean().optional(),
    CIE: zod_1.z.any().optional(),
    pièce: zod_1.z.any().optional(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
