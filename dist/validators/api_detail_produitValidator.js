"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_detail_produitValidator = void 0;
const zod_1 = require("zod");
exports.api_detail_produitValidator = zod_1.z.object({
    code: zod_1.z.string().min(1, "champ code du produit est requis"),
    options: zod_1.z.boolean().optional(),
    basecouvs: zod_1.z.boolean().optional(),
    clauses: zod_1.z.boolean().optional(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
