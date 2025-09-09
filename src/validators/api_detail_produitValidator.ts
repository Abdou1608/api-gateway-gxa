import { z } from "zod";

export const api_detail_produitValidator = z.object({
  code: z.string().min(1, "champ code du produit est requis"),
  options: z.boolean().optional(),
  basecouv: z.boolean().optional(),
  clauses: z.boolean().optional(),

  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});

