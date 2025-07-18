import { z } from "zod";

export const api_projects_project_listitemsValidator = z.object({
  dossier: z.number(),

  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
