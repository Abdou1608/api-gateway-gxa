"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_check_sessionValidator = void 0;
const zod_1 = require("zod");
exports.api_check_sessionValidator = zod_1.z.object({
    BasSecurityContext: zod_1.z.any().optional().nullable(),
});
