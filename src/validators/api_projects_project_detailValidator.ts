import { z } from "zod";

export const api_projects_project_detailValidator = z.object({
  dproj: z.number(),
});
