import { z } from "zod";

export const api_liste_des_quittancesValidator = z.object({
  contrat: z.any().describe("Champ contrat est requis, veuillez fournir le numero du contrat"),
  dossier:z.any().optional(),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
