import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';
import { zQueryString } from './zod.query';

export const api_contrats_searchValidator = z.object({
  reference: z.string().min(1, "champ requis"),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});

