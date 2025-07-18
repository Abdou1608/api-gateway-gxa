import { z } from "zod";

export const api_contrat_updateValidator = z.object({
  contrat: z.number(),
  piece: z.any(),
  concernée: z.any(),
  data: z.string().min(1, "champ requis"),
  modifier: z.any(),
});
