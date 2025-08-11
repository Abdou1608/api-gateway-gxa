import { z } from "zod";

export const api_update_piece_contratValidator = z.object({
  contrat: z.number(),
  piece:z.number().optional(),
  produit: z.string().min(1, "champ requis"),
  Effet: z.preprocess(val => (typeof val === "string" || val instanceof Date) ? new Date(val) : val, z.date().describe("Date d'effet invalide" )).optional(),
  modifier: z.any().optional(),
  data: z.any().optional(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
