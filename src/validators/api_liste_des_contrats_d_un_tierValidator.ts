import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';
import { zQueryBooleanOptional } from './zod.query';

export const api_liste_des_contrats_d_un_tierValidator = z.object({
  dossier: z.any(),
  includeall: zQueryBooleanOptional(),
  resilies: z.any().optional(),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});
