"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_detail_tierValidator = void 0;
const zod_1 = require("zod");
const basSecurityContext_query_1 = require("./basSecurityContext.query");
const zod_query_1 = require("./zod.query");
exports.api_detail_tierValidator = zod_1.z.object({
    Dossier: zod_1.z.any(),
    Composition: (0, zod_query_1.zQueryBooleanOptional)(),
    ListeEntites: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
    Extensions: (0, zod_query_1.zQueryBooleanOptional)(),
    BasSecurityContext: basSecurityContext_query_1.BasSecurityContextQuerySchema,
    domain: zod_1.z.string().optional(),
});
