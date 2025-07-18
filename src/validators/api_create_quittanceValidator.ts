import { z } from "zod";

export const api_create_quittanceValidator = z.object({
  contrat: z.number(),
  piece: z.number(),
  bordereau: z.number(),
  data: z.string().min(1, "champ requis"),
  crée: z.any(),
});
