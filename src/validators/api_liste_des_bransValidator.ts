import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';

export const api_liste_des_bransValidator = z.object({
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});