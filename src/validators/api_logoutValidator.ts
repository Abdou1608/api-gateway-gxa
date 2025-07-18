import { z } from "zod";

export const api_logoutValidator = z.object({
  BasSecurityContext: z.any(),
});
