import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';
import { zQueryBooleanOptional, zQueryNumberOptional } from './zod.query';

export const api_tiers_searchValidator = z.object({
  reference: z.string().min(1, "champ requis"),
  dppname:z.string().optional().refine(
    v => v === undefined || v.length > 0,
    { message: "doit être non vide si présent" }
  ),
  typetiers: zQueryNumberOptional(),
  codp: z.string().optional().refine(
    v => v === undefined || v.length > 0,
    { message: "doit être non vide si présent" }
  ),
  datenais: z.string().optional().refine(
    v => v === undefined || v.length > 0,
    { message: "doit être non vide si présent" }
  ),
  detailorigine: zQueryBooleanOptional(),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});

