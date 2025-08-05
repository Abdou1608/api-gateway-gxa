"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_contrat_updateValidator = void 0;
const zod_1 = require("zod");
exports.api_contrat_updateValidator = zod_1.z.object({
    contrat: zod_1.z.number(),
    piece: zod_1.z.number(),
    concernée: zod_1.z.any(),
    data: zod_1.z.any(),
    modifier: zod_1.z.any(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
