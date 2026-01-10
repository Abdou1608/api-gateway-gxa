import { z } from "zod";

export const api_projects_project_createValidator = z.object({
  dossier: z.number(),
  client: z.any().optional(),
  contrat: z.number().optional(),
  produit: z.string().min(1, "champ requis"),
  // Legacy session id keys sometimes sent by the frontend payload builder.
  SessionID: z.string().optional(),
  _SessionID: z.string().optional(),
  sessionId: z.string().optional(),
  _sessionId: z.string().optional(),
  username: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  libelle: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  resutXML: z.boolean().optional(),
  data: z.any(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
}).strict();
