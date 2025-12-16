import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';
import { zQueryNumber } from './zod.query';

export const api_detail_adhesionValidator = z.object({
  adhesion: zQueryNumber().describe("champ adhesion est requis"),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});
