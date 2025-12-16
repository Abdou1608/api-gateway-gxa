import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';
import { zQueryBooleanOptional, zQueryNumberOptional } from './zod.query';

export const api_liste_des_produitsValidator = z.object({
  typeecran: z.string().optional(),
  branche: z.string().optional(),
  cie: zQueryNumberOptional(),
  entite: zQueryNumberOptional(),
  disponible: zQueryBooleanOptional(),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});

