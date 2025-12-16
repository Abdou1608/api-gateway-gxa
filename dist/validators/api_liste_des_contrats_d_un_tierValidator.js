"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_liste_des_contrats_d_un_tierValidator = void 0;
const zod_1 = require("zod");
const basSecurityContext_query_1 = require("./basSecurityContext.query");
const zod_query_1 = require("./zod.query");
exports.api_liste_des_contrats_d_un_tierValidator = zod_1.z.object({
    dossier: zod_1.z.any(),
    includeall: (0, zod_query_1.zQueryBooleanOptional)(),
    resilies: zod_1.z.any().optional(),
    BasSecurityContext: basSecurityContext_query_1.BasSecurityContextQuerySchema,
    domain: zod_1.z.string().optional(),
});
