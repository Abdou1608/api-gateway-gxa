import { z } from "zod";

export const api_profileValidator = z.object({
  domain: z.string().min(1, "champ domain est requis"),
  email: z.string().optional().refine(v => v === undefined || v.length > 0, "Champ email doit être non vide si présent"),
  login: z.string().min(1, "champ login est requis"),
  dossier: z.string().optional().refine(v => v === undefined || v.length > 0, "champ dossier doit être non vide si présent"),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })

});
