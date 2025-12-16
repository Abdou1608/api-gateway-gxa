"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_liste_des_bransValidator = void 0;
const zod_1 = require("zod");
const basSecurityContext_query_1 = require("./basSecurityContext.query");
exports.api_liste_des_bransValidator = zod_1.z.object({
    BasSecurityContext: basSecurityContext_query_1.BasSecurityContextQuerySchema,
    domain: zod_1.z.string().optional(),
});
