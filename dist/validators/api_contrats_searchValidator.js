"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_contrats_searchValidator = void 0;
const zod_1 = require("zod");
exports.api_contrats_searchValidator = zod_1.z.object({
    reference: zod_1.z.string().min(1, "champ requis"),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
