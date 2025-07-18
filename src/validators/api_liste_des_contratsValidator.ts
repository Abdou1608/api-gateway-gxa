import { z } from "zod";

export const api_liste_des_contratsValidator = z.object({
  reference: z.string().min(1, "champ requis"),
  detailorigine: z.boolean().optional(),
  nomchamp: z.any(),

  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
