import { z } from "zod";
import { BasSecurityContextQuerySchema } from './basSecurityContext.query';
import { zQueryBooleanOptional } from './zod.query';
import { Contrat } from "../Model/contrat.model";

export const api_detail_contratValidator = z.object({
  contrat:z.any().optional(),
  Contrat: z.any().optional(),
  Allpieces: zQueryBooleanOptional(),
  basecouv: zQueryBooleanOptional(),
  Extentions: zQueryBooleanOptional(),
  DetailAdh: zQueryBooleanOptional(),
  infosCieProd: zQueryBooleanOptional(),
  Garanties: zQueryBooleanOptional(),
  clauses: zQueryBooleanOptional(),
  BasSecurityContext: BasSecurityContextQuerySchema,
  domain: z.string().optional(),
});