"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_projects_project_offerlistitemsValidator = void 0;
const zod_1 = require("zod");
exports.api_projects_project_offerlistitemsValidator = zod_1.z.object({
    idproj: zod_1.z.number(),
    projet: zod_1.z.any(),
});
