import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';

export const api_sinistres_sinistre_detailValidator = z.object({
  sinistre: z.any(),

  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});
