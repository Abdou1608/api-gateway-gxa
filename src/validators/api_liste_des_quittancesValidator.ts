import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';

export const api_liste_des_quittancesValidator = z.object({
  contrat: z.any().optional().describe("Champ contrat est requis, veuillez fournir le numero du contrat"),
  dossier:z.any().optional(),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});
