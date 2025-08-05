import { z } from "zod";

export const api_contrat_updateValidator = z.object({
  contrat: z.number(),
  piece: z.number(),
  concernée: z.any(),
  data: z.any(),
  modifier: z.any(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
