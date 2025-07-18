import { z } from "zod";

export const api_loginValidator = z.object({
  logon: z.string().min(1, "champ requis"),
  password: z.string().min(1, "champ requis"),
  Domain: z.string().min(1, "champ requis"),
});
