"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_projects_project_addofferValidator = void 0;
const zod_1 = require("zod");
exports.api_projects_project_addofferValidator = zod_1.z.object({
    idproj: zod_1.z.number(),
    produit: zod_1.z.string().min(1, "champ requis"),
    user: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    resutXML: zod_1.z.boolean().optional(),
    optionnel: zod_1.z.any(),
    data: zod_1.z.any(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
