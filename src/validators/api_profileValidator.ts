import { z } from "zod";

export const api_profileValidator = z.object({
  domain: z.string().min(1, "champ requis"),
  email: z.string().min(1, "champ requis"),
  login: z.string().min(1, "champ requis"),
  dossier: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
});
