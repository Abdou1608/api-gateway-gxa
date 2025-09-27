import { ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../common/errors";

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      // Centralized: forward to error handler
      const issues = result.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return next(new ValidationError('Le corps de la requête est invalide.', issues));
    }
    req.body = result.data;
    next();
  };
}
