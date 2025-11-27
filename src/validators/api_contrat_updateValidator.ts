import { z } from "zod";

export const api_contrat_updateValidator = z.object({
  contrat: z.number(),
  effet:z.string().optional(),
  piece: z.number().optional(),
  data: z.any(),
  modifier: z.any().optional()
});
