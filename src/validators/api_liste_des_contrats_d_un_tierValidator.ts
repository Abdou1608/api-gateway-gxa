import { z } from "zod";

export const api_liste_des_contrats_d_un_tierValidator = z.object({
  dossier: z.number(),
  IncludeAll: z.boolean(),
  False: z.any(),
  résiliés: z.any(),
});
