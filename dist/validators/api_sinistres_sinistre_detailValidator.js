"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_sinistres_sinistre_detailValidator = void 0;
const zod_1 = require("zod");
exports.api_sinistres_sinistre_detailValidator = zod_1.z.object({
    sinistre: zod_1.z.any(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
