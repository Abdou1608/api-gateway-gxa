"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_projects_project_listitemsValidator = void 0;
const zod_1 = require("zod");
const basSecurityContext_query_1 = require("./basSecurityContext.query");
const zod_query_1 = require("./zod.query");
exports.api_projects_project_listitemsValidator = zod_1.z.object({
    dossier: (0, zod_query_1.zQueryNumber)(),
    BasSecurityContext: basSecurityContext_query_1.BasSecurityContextQuerySchema,
    domain: zod_1.z.string().optional(),
});
