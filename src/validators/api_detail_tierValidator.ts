import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';
import { zQueryBooleanOptional } from './zod.query';

export const api_detail_tierValidator = z.object({
  Dossier: z.any(),
  Composition: zQueryBooleanOptional(),
  ListeEntites: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  Extensions: zQueryBooleanOptional(),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});
