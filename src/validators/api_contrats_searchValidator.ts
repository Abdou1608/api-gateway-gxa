import { z } from "zod";

export const api_contrats_searchValidator = z.object({
  reference: z.string().min(1, "champ requis"),

  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});

