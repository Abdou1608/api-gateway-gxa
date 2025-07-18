import { z } from "zod";

export const api_detail_contratValidator = z.object({
  contrat: z.number(),
  Allpieces: z.boolean(),
  pieces: z.any(),
  sinon: z.any(),
  DetailAdh: z.boolean(),
  RISA: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  RIMM: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  RVEH: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  RDIV: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  RDPP: z.string().optional().refine(v => v === undefined || v.length > 0, "doit être non vide si présent"),
  Garanties: z.boolean(),
  Extensions: z.boolean(),
  infosCieProd: z.boolean(),
  CIE: z.any(),
  pièce: z.any(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
