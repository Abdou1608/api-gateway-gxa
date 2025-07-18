import { z } from "zod";

export const api_projects_project_listitemsValidator = z.object({
  dossier: z.number(),
});
