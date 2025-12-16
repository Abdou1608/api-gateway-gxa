"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_detail_adhesionValidator = void 0;
const zod_1 = require("zod");
const basSecurityContext_query_1 = require("./basSecurityContext.query");
const zod_query_1 = require("./zod.query");
exports.api_detail_adhesionValidator = zod_1.z.object({
    adhesion: (0, zod_query_1.zQueryNumber)().describe("champ adhesion est requis"),
    BasSecurityContext: basSecurityContext_query_1.BasSecurityContextQuerySchema,
    domain: zod_1.z.string().optional(),
});
