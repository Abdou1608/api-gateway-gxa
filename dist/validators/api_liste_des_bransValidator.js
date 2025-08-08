"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_liste_des_bransValidator = void 0;
const zod_1 = require("zod");
exports.api_liste_des_bransValidator = zod_1.z.object({
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
