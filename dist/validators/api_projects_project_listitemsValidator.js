"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_projects_project_listitemsValidator = void 0;
const zod_1 = require("zod");
exports.api_projects_project_listitemsValidator = zod_1.z.object({
    dossier: zod_1.z.number(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
