"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_sinistres_sinistre_detailValidator = void 0;
const zod_1 = require("zod");
const basSecurityContext_query_1 = require("./basSecurityContext.query");
exports.api_sinistres_sinistre_detailValidator = zod_1.z.object({
    sinistre: zod_1.z.any(),
    BasSecurityContext: basSecurityContext_query_1.BasSecurityContextQuerySchema,
    domain: zod_1.z.string().optional(),
});
