"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_profileValidator = void 0;
const zod_1 = require("zod");
exports.api_profileValidator = zod_1.z.object({
    domain: zod_1.z.string().min(1, "champ domain est requis"),
    email: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "Champ email doit être non vide si présent"),
    login: zod_1.z.string().min(1, "champ login est requis"),
    dossier: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "champ dossier doit être non vide si présent"),
});
