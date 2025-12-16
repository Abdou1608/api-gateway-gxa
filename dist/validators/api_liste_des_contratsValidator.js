"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_liste_des_contratsValidator = void 0;
const zod_1 = require("zod");
const basSecurityContext_query_1 = require("./basSecurityContext.query");
const zod_query_1 = require("./zod.query");
exports.api_liste_des_contratsValidator = zod_1.z.object({
    reference: zod_1.z.string().min(1, "champ requis"),
    detailorigine: (0, zod_query_1.zQueryBooleanOptional)(),
    nomchamp: zod_1.z.any(),
    BasSecurityContext: basSecurityContext_query_1.BasSecurityContextQuerySchema,
    domain: zod_1.z.string().optional(),
});
