import { z } from "zod";

export const api_detail_tierValidator = z.object({
  Dossier: z.number(),
  Composition: z.boolean().optional(),
  ListeEntites: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  Extensions: z.boolean().optional(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
