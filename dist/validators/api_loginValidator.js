"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_loginValidator = void 0;
const zod_1 = require("zod");
exports.api_loginValidator = zod_1.z.object({
    username: zod_1.z.string().min(1, "champ username est requis"),
    password: zod_1.z.string().min(1, "champ password est requis"),
    domain: zod_1.z.string().min(1, "champ domain est requis"),
});
