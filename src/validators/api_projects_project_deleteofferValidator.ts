import { z } from "zod";

export const api_projects_project_deleteofferValidator = z.object({
  idproj: z.number(),
  idoffer: z.number(),

  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
