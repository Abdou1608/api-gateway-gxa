"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Legacy Express router kept as a no-op to satisfy TS include; Fastify-native routes handle tabs.
const tabrouter = (0, express_1.Router)();
exports.default = tabrouter;
