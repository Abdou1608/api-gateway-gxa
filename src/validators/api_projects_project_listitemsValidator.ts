import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';
import { zQueryNumber } from './zod.query';

export const api_projects_project_listitemsValidator = z.object({
  dossier: zQueryNumber(),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});
