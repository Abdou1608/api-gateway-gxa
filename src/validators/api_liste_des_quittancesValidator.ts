import { z } from "zod";

export const api_liste_des_quittancesValidator = z.object({
  contrat: z.number().optional(),
});
