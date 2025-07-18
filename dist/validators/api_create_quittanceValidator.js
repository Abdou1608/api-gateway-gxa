"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_create_quittanceValidator = void 0;
const zod_1 = require("zod");
exports.api_create_quittanceValidator = zod_1.z.object({
    contrat: zod_1.z.number(),
    piece: zod_1.z.number(),
    bordereau: zod_1.z.number(),
    data: zod_1.z.string().min(1, "champ requis"),
    crée: zod_1.z.any(),
});
