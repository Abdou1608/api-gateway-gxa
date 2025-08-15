"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_detail_adhesionValidator = void 0;
const zod_1 = require("zod");
exports.api_detail_adhesionValidator = zod_1.z.object({
    adhesion: zod_1.z.number().describe("champ SessionId est requis"),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
