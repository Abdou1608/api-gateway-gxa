"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Legacy Express router kept as a no-op to satisfy TS include; Fastify-native routes handle projects.
const router = (0, express_1.Router)();
exports.default = router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
