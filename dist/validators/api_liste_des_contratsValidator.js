"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_liste_des_contratsValidator = void 0;
const zod_1 = require("zod");
exports.api_liste_des_contratsValidator = zod_1.z.object({
    reference: zod_1.z.string().min(1, "champ requis"),
    detailorigine: zod_1.z.boolean().optional(),
    nomchamp: zod_1.z.any(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
