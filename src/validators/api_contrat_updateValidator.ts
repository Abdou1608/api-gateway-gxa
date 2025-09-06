import { z } from "zod";

export const api_contrat_updateValidator = z.object({
  contrat: z.number(),
  effet:z.string().optional(),
  piece: z.number().optional(),
  concernée:z.string().optional(),
  data: z.any(),
  modifier: z.any().optional(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
