import { z } from "zod";

export const api_projects_project_addofferValidator = z.object({
  idproj: z.number(),
  produit: z.string().min(1, "champ requis"),
  // Frontend also sends proposition metadata for client-side flows.
  // SOAP Project_AddOffer currently only consumes { idproj, produit }, so we accept and ignore.
  nom_prop: z.string().optional(),
  type: z.string().optional(),
  // Legacy session id keys sometimes sent by frontend payload builders.
  SessionID: z.string().optional(),
  _SessionID: z.string().optional(),
  sessionId: z.string().optional(),
  _sessionId: z.string().optional(),
  user: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  resutXML: z.boolean().optional(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
}).strict();
