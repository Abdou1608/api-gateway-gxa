"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasSecurityContextQueryRequiredSchema = exports.BasSecurityContextQuerySchema = void 0;
const zod_1 = require("zod");
const zod_query_1 = require("./zod.query");
const BasSecurityContextInnerSchema = zod_1.z
    .object({
    _SessionId: zod_1.z.string().min(1).optional(),
    SessionId: zod_1.z.string().min(1).optional(),
})
    .passthrough();
exports.BasSecurityContextQuerySchema = (0, zod_query_1.zQueryJsonObjectOptional)(BasSecurityContextInnerSchema);
exports.BasSecurityContextQueryRequiredSchema = (0, zod_query_1.zQueryJsonObject)(BasSecurityContextInnerSchema);
