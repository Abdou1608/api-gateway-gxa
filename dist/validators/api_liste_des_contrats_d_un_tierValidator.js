"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_liste_des_contrats_d_un_tierValidator = void 0;
const zod_1 = require("zod");
exports.api_liste_des_contrats_d_un_tierValidator = zod_1.z.object({
    dossier: zod_1.z.number(),
    IncludeAll: zod_1.z.boolean(),
    False: zod_1.z.any(),
    résiliés: zod_1.z.any(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
