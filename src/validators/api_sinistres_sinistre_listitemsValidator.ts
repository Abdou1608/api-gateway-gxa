import { z } from "zod";

export const api_sinistres_sinistre_listitemsValidator = z.object({
  dossier: z.any().optional(),
  contrat:z.any().optional(),
  BasSecurityContext:z.object({
    _SessionId:z.string().optional()
     }).optional()
});
