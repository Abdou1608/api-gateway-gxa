import { z } from "zod";

export const api_create_reglementValidator = z.object({
  typeoperation: z.string().min(1, "champ requis"),
  typeenc: z.string().min(1, "champ requis"),
  targetkind: z.string().min(1, "champ requis"),
  targetqintid: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  montant: z.number(),
  devise: z.string().min(1, "champ requis"),
  date: z.preprocess(val => (typeof val === "string" || val instanceof Date) ? new Date(val) : val, z.date()).optional(),
  défaut: z.any(),
  dateff: z.preprocess(val => (typeof val === "string" || val instanceof Date) ? new Date(val) : val, z.date()).optional(),
  reference: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  tierspayeur: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  data: z.any(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
