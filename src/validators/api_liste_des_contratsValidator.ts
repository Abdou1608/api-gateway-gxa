import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';
import { zQueryBooleanOptional } from './zod.query';

export const api_liste_des_contratsValidator = z.object({
  reference: z.string().min(1, "champ requis"),
  detailorigine: zQueryBooleanOptional(),
  nomchamp: z.any(),

  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});
