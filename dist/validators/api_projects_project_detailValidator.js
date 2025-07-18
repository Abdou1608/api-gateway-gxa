"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_projects_project_detailValidator = void 0;
const zod_1 = require("zod");
exports.api_projects_project_detailValidator = zod_1.z.object({
    dproj: zod_1.z.number(),
});
