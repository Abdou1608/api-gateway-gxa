import { z } from "zod";

export const api_detail_adhesionValidator = z.object({
    adhesion: z.number().describe( "champ SessionId est requis"),
  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});
