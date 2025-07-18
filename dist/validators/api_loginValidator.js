"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_loginValidator = void 0;
const zod_1 = require("zod");
exports.api_loginValidator = zod_1.z.object({
    username: zod_1.z.string().min(1, "champ requis"),
    password: zod_1.z.string().min(1, "champ requis"),
    Domain: zod_1.z.string().min(1, "champ requis"),
});
