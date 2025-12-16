"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_detail_contratValidator = void 0;
const zod_1 = require("zod");
const basSecurityContext_query_1 = require("./basSecurityContext.query");
const zod_query_1 = require("./zod.query");
exports.api_detail_contratValidator = zod_1.z.object({
    contrat: zod_1.z.any().optional(),
    Contrat: zod_1.z.any().optional(),
    Allpieces: (0, zod_query_1.zQueryBooleanOptional)(),
    basecouv: (0, zod_query_1.zQueryBooleanOptional)(),
    Extentions: (0, zod_query_1.zQueryBooleanOptional)(),
    DetailAdh: (0, zod_query_1.zQueryBooleanOptional)(),
    infosCieProd: (0, zod_query_1.zQueryBooleanOptional)(),
    Garanties: (0, zod_query_1.zQueryBooleanOptional)(),
    clauses: (0, zod_query_1.zQueryBooleanOptional)(),
    BasSecurityContext: basSecurityContext_query_1.BasSecurityContextQuerySchema,
    domain: zod_1.z.string().optional(),
});
