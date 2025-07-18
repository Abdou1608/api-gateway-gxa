import { z } from "zod";

export const api_tiers_searchValidator = z.object({
  reference: z.string().min(1, "champ requis"),
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
});

