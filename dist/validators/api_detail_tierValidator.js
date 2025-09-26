"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_detail_tierValidator = void 0;
const zod_1 = require("zod");
exports.api_detail_tierValidator = zod_1.z.object({
    Dossier: zod_1.z.any(),
    Composition: zod_1.z.boolean().optional(),
    ListeEntites: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    Extensions: zod_1.z.boolean().optional(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().optional(),
    }).optional(),
});
