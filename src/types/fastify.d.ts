import type { Env } from "./env";
declare module "fastify" { interface FastifyInstance { config: Env } }
