import { z } from "zod";

export const api_projects_project_validateofferValidator = z.object({
  idproj: z.number(),
  idoffer: z.number(),
  effet: z.preprocess(val => (typeof val === "string" || val instanceof Date) ? new Date(val) : val, z.date()).optional(),
  défaut: z.any(),
  Avenant: z.boolean().optional(),
  optionnel: z.any(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
