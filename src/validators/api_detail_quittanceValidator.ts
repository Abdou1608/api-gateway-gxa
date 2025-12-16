import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';
import { zQueryBooleanOptional, zQueryNumber } from './zod.query';

export const api_detail_quittanceValidator = z.object({
  quittance: zQueryNumber(),
  details: zQueryBooleanOptional(),
  garanties: zQueryBooleanOptional(),
  addinfospqg: zQueryBooleanOptional(),
  intervenants: zQueryBooleanOptional(),
  addinfosqint: zQueryBooleanOptional(),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});

