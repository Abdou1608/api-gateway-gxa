"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_tiers_searchValidator = void 0;
const zod_1 = require("zod");
exports.api_tiers_searchValidator = zod_1.z.object({
    reference: zod_1.z.string().min(1, "champ requis"),
    typetiers: zod_1.z.number().optional(),
    codp: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, { message: "doit être non vide si présent" }),
    datenais: zod_1.z.string().optional().refine(v => v === undefined || v.length > 0, { message: "doit être non vide si présent" }),
    detailorigine: zod_1.z.boolean().optional(),
});
