import { z } from "zod";

export const api_projects_project_addofferValidator = z.object({
  idproj: z.number(),
  produit: z.string().min(1, "champ requis"),
  user: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  resutXML: z.boolean().optional(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
