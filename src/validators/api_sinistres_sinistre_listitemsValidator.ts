import { z } from "zod";

export const api_sinistres_sinistre_listitemsValidator = z.object({
  dossier: z.number(),
  contrat: z.number().optional(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
