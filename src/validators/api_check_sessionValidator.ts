import { z } from "zod";

export const api_check_sessionValidator = z.object({
  BasSecurityContext: z.any(),
});
