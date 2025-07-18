import { z } from "zod";

export const api_detail_produitValidator = z.object({
  code: z.string().min(1, "champ requis"),
  options: z.boolean().optional(),
  basecouvs: z.boolean().optional(),
  clauses: z.boolean().optional(),
});

