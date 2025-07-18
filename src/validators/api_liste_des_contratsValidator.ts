import { z } from "zod";

export const api_liste_des_contratsValidator = z.object({
  reference: z.string().min(1, "champ requis"),
  detailorigine: z.boolean().optional(),
  False: z.any(),
  true: z.any(),
  nomchamp: z.any(),
});
