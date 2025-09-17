import { z } from "zod";

export const api_liste_des_produitsValidator = z.object({
  typeecran: z.string().optional(),
  branche: z.string().optional(),
  cie: z.number().optional(),
  entite: z.number().optional(),
  disponible: z.boolean().optional(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});

