import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';

export const api_sinistres_sinistre_listitemsValidator = z.object({
  dossier: z.any().optional(),
  contrat:z.any().optional(),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});
