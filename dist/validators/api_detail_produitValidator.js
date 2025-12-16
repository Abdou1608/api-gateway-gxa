"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_detail_produitValidator = void 0;
const zod_1 = require("zod");
const basSecurityContext_query_1 = require("./basSecurityContext.query");
const zod_query_1 = require("./zod.query");
exports.api_detail_produitValidator = zod_1.z.object({
    code: zod_1.z.string().min(1, "champ code du produit est requis"),
    options: (0, zod_query_1.zQueryBooleanOptional)(),
    basecouv: (0, zod_query_1.zQueryBooleanOptional)(),
    clauses: (0, zod_query_1.zQueryBooleanOptional)(),
    BasSecurityContext: basSecurityContext_query_1.BasSecurityContextQuerySchema,
    domain: zod_1.z.string().optional(),
});
