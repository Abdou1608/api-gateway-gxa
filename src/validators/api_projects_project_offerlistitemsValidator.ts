import { z } from "zod";

export const api_projects_project_offerlistitemsValidator = z.object({
  idproj: z.number(),
  projet: z.any(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
