"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_liste_des_produitsValidator = void 0;
const zod_1 = require("zod");
const basSecurityContext_query_1 = require("./basSecurityContext.query");
const zod_query_1 = require("./zod.query");
exports.api_liste_des_produitsValidator = zod_1.z.object({
    typeecran: zod_1.z.string().optional(),
    branche: zod_1.z.string().optional(),
    cie: (0, zod_query_1.zQueryNumberOptional)(),
    entite: (0, zod_query_1.zQueryNumberOptional)(),
    disponible: (0, zod_query_1.zQueryBooleanOptional)(),
    BasSecurityContext: basSecurityContext_query_1.BasSecurityContextQuerySchema,
    domain: zod_1.z.string().optional(),
});
