import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';
import { zQueryBooleanOptional } from './zod.query';

export const api_detail_produitValidator = z.object({
  code: z.string().min(1, "champ code du produit est requis"),
  options: zQueryBooleanOptional(),
  basecouv: zQueryBooleanOptional(),
  clauses: zQueryBooleanOptional(),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});

