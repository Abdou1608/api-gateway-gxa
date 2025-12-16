"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_detail_quittanceValidator = void 0;
const zod_1 = require("zod");
const basSecurityContext_query_1 = require("./basSecurityContext.query");
const zod_query_1 = require("./zod.query");
exports.api_detail_quittanceValidator = zod_1.z.object({
    quittance: (0, zod_query_1.zQueryNumber)(),
    details: (0, zod_query_1.zQueryBooleanOptional)(),
    garanties: (0, zod_query_1.zQueryBooleanOptional)(),
    addinfospqg: (0, zod_query_1.zQueryBooleanOptional)(),
    intervenants: (0, zod_query_1.zQueryBooleanOptional)(),
    addinfosqint: (0, zod_query_1.zQueryBooleanOptional)(),
    BasSecurityContext: basSecurityContext_query_1.BasSecurityContextQuerySchema,
    domain: zod_1.z.string().optional(),
});
