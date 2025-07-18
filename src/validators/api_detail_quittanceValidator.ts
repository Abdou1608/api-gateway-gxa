import { z } from "zod";

export const api_detail_quittanceValidator = z.object({
  quittance: z.number(),
  details: z.boolean().optional(),
  garanties: z.boolean().optional(),
  addinfospqg: z.boolean().optional(),
  intervenants: z.boolean().optional(),
  addinfosqint: z.boolean().optional(),

  BasSecurityContext:z.object({
    _SessionId:z.string().min(1, "champ SessionId est requis"),
     })
});

