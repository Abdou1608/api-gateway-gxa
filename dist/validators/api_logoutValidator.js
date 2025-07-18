"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_logoutValidator = void 0;
const zod_1 = require("zod");
exports.api_logoutValidator = zod_1.z.object({
    BasSecurityContext: zod_1.z.any(),
});
