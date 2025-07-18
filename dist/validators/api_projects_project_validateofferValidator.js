"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_projects_project_validateofferValidator = void 0;
const zod_1 = require("zod");
exports.api_projects_project_validateofferValidator = zod_1.z.object({
    idproj: zod_1.z.number(),
    idoffer: zod_1.z.number(),
    effet: zod_1.z.preprocess(val => (typeof val === "string" || val instanceof Date) ? new Date(val) : val, zod_1.z.date()).optional(),
    défaut: zod_1.z.any(),
    Avenant: zod_1.z.boolean().optional(),
    optionnel: zod_1.z.any(),
});
