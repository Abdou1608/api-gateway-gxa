import { z } from "zod";

export const api_projects_project_deleteofferValidator = z.object({
  idproj: z.number(),
  idoffer: z.number(),
});
