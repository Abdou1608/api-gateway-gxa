import { z } from "zod";

export const api_create_quittanceValidator = z.object({
  contrat: z.number(),
  piece: z.number(),
  bordereau: z.number(),
  datedebut:z.string().optional(),
  datedefin:z.string().optional(),
  data: z.any().optional(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
