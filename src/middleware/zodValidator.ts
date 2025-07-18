import { ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
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
