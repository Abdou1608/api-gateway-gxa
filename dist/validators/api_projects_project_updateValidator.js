"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_projects_project_updateValidator = void 0;
const zod_1 = require("zod");
exports.api_projects_project_updateValidator = zod_1.z.object({
    idproj: zod_1.z.number(),
    username: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    libelle: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    resutXML: zod_1.z.boolean().optional(),
});
