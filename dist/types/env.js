"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSchema = void 0;
const zod_1 = require("zod");
exports.EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.string().default('8080'),
    SWAGGER_ENABLE: zod_1.z.string().default('true'),
    BROKER_SERVICE_URL: zod_1.z.string().url(),
    USER_SERVICE_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(16)
});
