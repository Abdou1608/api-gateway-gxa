import { z } from "zod";

export const api_liste_des_bransValidator = z.object({
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});