import { z } from "zod";

export const api_tiers_searchValidator = z.object({
  reference: z.string().min(1, "champ requis"),
  dppname:z.string().optional().refine(
    v => v === undefined || v.length > 0,
    { message: "doit être non vide si présent" }
  ),
  typetiers: z.number().optional(),
  codp: z.string().optional().refine(
    v => v === undefined || v.length > 0,
    { message: "doit être non vide si présent" }
  ),
  datenais: z.string().optional().refine(
    v => v === undefined || v.length > 0,
    { message: "doit être non vide si présent" }
  ),
  detailorigine: z.boolean().optional(),

  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});

