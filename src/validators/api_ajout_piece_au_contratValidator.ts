import { z } from "zod";

export const api_ajout_piece_au_contratValidator = z.object({
  contrat: z.number(),
  produit: z.string().min(1, "champ requis"),
  Effet: z.preprocess(val => (typeof val === "string" || val instanceof Date) ? new Date(val) : val, z.date()),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
