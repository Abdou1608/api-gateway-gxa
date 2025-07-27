import { z } from "zod";

export const api_liste_des_contrats_d_un_tierValidator = z.object({
  dossier: z.number(),
  IncludeAll: z.boolean().optional(),
  résiliés: z.any().optional(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
