import { z } from "zod";

export const api_create_quittanceValidator = z.object({
  contrat: z.number(),
  piece: z.number(),
  bordereau: z.number(),
  crée: z.any(),
  data: z.any(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
