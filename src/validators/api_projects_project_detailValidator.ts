import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';
import { zQueryNumber } from './zod.query';

export const api_projects_project_detailValidator = z.object({
  idproj: zQueryNumber(),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});
