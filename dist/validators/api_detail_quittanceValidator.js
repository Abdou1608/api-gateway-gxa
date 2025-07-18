"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_detail_quittanceValidator = void 0;
const zod_1 = require("zod");
exports.api_detail_quittanceValidator = zod_1.z.object({
    quittance: zod_1.z.number(),
    details: zod_1.z.boolean().optional(),
    garanties: zod_1.z.boolean().optional(),
    addinfospqg: zod_1.z.boolean().optional(),
    intervenants: zod_1.z.boolean().optional(),
    addinfosqint: zod_1.z.boolean().optional(),
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, "champ SessionId est requis"),
    })
});
