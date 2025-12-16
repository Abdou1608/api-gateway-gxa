"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_contrats_searchValidator = void 0;
const zod_1 = require("zod");
const basSecurityContext_query_1 = require("./basSecurityContext.query");
exports.api_contrats_searchValidator = zod_1.z.object({
    reference: zod_1.z.string().min(1, "champ requis"),
    BasSecurityContext: basSecurityContext_query_1.BasSecurityContextQuerySchema,
    domain: zod_1.z.string().optional(),
});
