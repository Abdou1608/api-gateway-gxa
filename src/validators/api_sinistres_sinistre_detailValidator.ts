import { z } from "zod";

export const api_sinistres_sinistre_detailValidator = z.object({
  sinistre: z.any(),

  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
