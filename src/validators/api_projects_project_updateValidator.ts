import { z } from "zod";

export const api_projects_project_updateValidator = z.object({
  idproj: z.number(),
  username: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  libelle: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  resutXML: z.boolean().optional(),
  data: z.any(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
