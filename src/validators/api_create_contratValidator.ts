import { z } from "zod";

export const api_create_contratValidator = z.object({
  dossier: z.number(),
  produit: z.string().min(1, "champ requis"),
  Effet: z.preprocess(val => (typeof val === "string" || val instanceof Date) ? new Date(val) : val, z.date()),
  défaut: z.any(),
  pièce: z.any(),
});
