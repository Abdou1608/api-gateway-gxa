import { z } from "zod";

export const api_detail_contratValidator = z.object({
  contrat: z.any(),
  Allpieces: z.boolean().optional(),
  pieces: z.any().optional(),

  DetailAdh: z.boolean().optional(),
  RISA: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  RIMM: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  RVEH: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  RDIV: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  RDPP: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  Garanties: z.boolean().optional(),
  Extensions: z.boolean().optional(),
  infosCieProd: z.boolean().optional(),
  CIE: z.any().optional(),
  pièce: z.any().optional(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
