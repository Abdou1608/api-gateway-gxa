import { z } from "zod";

export const api_loginValidator = z.object({
  username: z.string().min(1, "champ username est requis"),
  password: z.string().min(1, "champ password est requis"),
  domain: z.string().min(1, "champ domain est requis"),
});
