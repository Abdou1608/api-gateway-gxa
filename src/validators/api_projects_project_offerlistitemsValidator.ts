import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';
import { zQueryNumber } from './zod.query';

export const api_projects_project_offerlistitemsValidator = z.object({
  idproj: zQueryNumber(),
  //projet: z.any(),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});
