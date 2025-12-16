import { z } from 'zod';
import { zQueryJsonObject, zQueryJsonObjectOptional } from './zod.query';

const BasSecurityContextInnerSchema = z
  .object({
    _SessionId: z.string().min(1).optional(),
    SessionId: z.string().min(1).optional(),
  })
  .passthrough();

export const BasSecurityContextQuerySchema = zQueryJsonObjectOptional(BasSecurityContextInnerSchema);

export const BasSecurityContextQueryRequiredSchema = zQueryJsonObject(BasSecurityContextInnerSchema);
