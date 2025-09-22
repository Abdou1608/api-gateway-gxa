import { z } from "zod";

export const api_sinistres_sinistre_createValidator = z.object({
  dossier: z.number(),
  client: z.any().optional(),
  contrat: z.number().optional(),
  produit: z.string().min(1, "champ requis"),
  username: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  libelle: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  resutXML: z.boolean().optional(),
  data: z.any(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
