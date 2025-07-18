"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            // Transformation des issues en message lisible
            const erreurs = result.error.issues.map(issue => ({
                champ: issue.path.join("."),
                message: issue.message, // déjà localisé par tes .min(1, "...") etc.
            }));
            return res.status(400).json({
                erreur: "Le corps de la requête est invalide.",
                details: erreurs,
            });
        }
        req.body = result.data;
        next();
    };
}
