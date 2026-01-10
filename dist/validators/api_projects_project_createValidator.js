"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_projects_project_createValidator = void 0;
const zod_1 = require("zod");
exports.api_projects_project_createValidator = zod_1.z.object({
    dossier: zod_1.z.number(),
    client: zod_1.z.any().optional(),
    contrat: zod_1.z.number().optional(),
    produit: zod_1.z.string().min(1, "champ requis"),
    // Legacy session id keys sometimes sent by the frontend payload builder.
    SessionID: zod_1.z.string().optional(),
    _SessionID: zod_1.z.string().optional(),
    sessionId: zod_1.z.string().optional(),
    _sessionId: zod_1.z.string().optional(),
    username: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    libelle: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    resutXML: zod_1.z.boolean().optional(),
    data: zod_1.z.any(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
}).strict();
