"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
const errors_1 = require("../common/errors");
function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            // Centralized: forward to error handler
            const issues = result.error.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message,
            }));
            return next(new errors_1.ValidationError('Le corps de la requête est invalide.', issues));
        }
        req.body = result.data;
        next();
    };
}
