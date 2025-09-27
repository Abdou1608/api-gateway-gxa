"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = requestIdMiddleware;
const crypto_1 = require("crypto");
function requestIdMiddleware(req, res, next) {
    const fromHeader = req.header('x-request-id');
    const id = fromHeader && fromHeader.trim() !== '' ? fromHeader : (0, crypto_1.randomUUID)();
    req.requestId = id;
    res.locals.requestId = id;
    res.setHeader('x-request-id', id);
    next();
}
