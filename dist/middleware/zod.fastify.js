"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBodyFastify = validateBodyFastify;
exports.validateQueryFastify = validateQueryFastify;
exports.parseQueryOrThrow = parseQueryOrThrow;
const errors_1 = require("../common/errors");
function validateBodyFastify(schema) {
    return async (request, reply) => {
        const result = schema.safeParse(request.body);
        if (!result.success) {
            const issues = result.error.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message,
            }));
            // Mirror centralized error handling
            reply.code(400).send(new errors_1.ValidationError('Le corps de la requête est invalide.', issues));
            return;
        }
        request.body = result.data;
    };
}
function validateQueryFastify(schema) {
    return async (request, reply) => {
        const result = schema.safeParse(request.query);
        if (!result.success) {
            const issues = result.error.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message,
            }));
            reply.code(400).send(new errors_1.ValidationError('La query string est invalide.', issues));
            return;
        }
        request.query = result.data;
    };
}
function parseQueryOrThrow(request, schema) {
    const result = schema.safeParse(request.query);
    if (!result.success) {
        const issues = result.error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));
        throw new errors_1.ValidationError('La query string est invalide.', issues);
    }
    return result.data;
}
