"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_projects_project_addofferValidator = void 0;
const zod_1 = require("zod");
exports.api_projects_project_addofferValidator = zod_1.z.object({
    idproj: zod_1.z.number(),
    produit: zod_1.z.string().min(1, "champ requis"),
    // Frontend also sends proposition metadata for client-side flows.
    // SOAP Project_AddOffer currently only consumes { idproj, produit }, so we accept and ignore.
    nom_prop: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    // Legacy session id keys sometimes sent by frontend payload builders.
    SessionID: zod_1.z.string().optional(),
    _SessionID: zod_1.z.string().optional(),
    sessionId: zod_1.z.string().optional(),
    _sessionId: zod_1.z.string().optional(),
    user: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    resutXML: zod_1.z.boolean().optional(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
}).strict();
