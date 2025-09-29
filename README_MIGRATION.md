# Fastify Migration Summary

This gateway has been migrated from Express to Fastify. Nearly all business endpoints are now Fastify-native, with an Express bridge retained for admin/logout UIs only.

## What changed
- Fastify server bootstrap with CORS, rate limit, under-pressure, Swagger UI, correlation IDs, metrics, and global error handling.
- Auth preHandler maps JWT → SID and injects BasSecurityContext fields.
- Zod preValidation helper ensures schema validation.
- OpenAPI served at `/openapi.json`, docs at `/docs`.
- Prometheus metrics exposed at `/metrics`.

## Native Fastify endpoints
- Auth/Profile: `/api/login`, `/api/profile`, `/health`, `/ping`
- Lists/Details: `/api/liste_des_contrats`, `/api/liste_des_produits`, `/api/liste_des_quittances`, `/api/detail_contrat`, `/api/detail_produit`, `/api/detail_quittance`, `/api/liste_des_types_ecrans`
- Tiers/Dossiers: `/api/detail_tier`, `/api/liste_des_contrats_d_un_tier`, `/api/Tiers_Search`, `PUT /api/Tiers_Update`
- Create/Update: `/api/create_contrat`, `/api/create_quittance`, `/api/create_quittance/autocalcule`, `/api/create_reglement`, `/api/create_tier`, `/api/Contrat_Update`, `/api/update_piece_contrat`
- Session/Adhésion: `/api/check_session`, `/api/detail_adhesion`
- Projects: `/api/projects/project_listitems`, `/api/projects/Project_OfferListItems`, `/api/projects/project_detail`, `/api/projects/project_create`, `/api/projects/project_update`, `/api/projects/project_addoffer`, `/api/projects/project_deleteoffer`, `/api/projects/project_validateoffer`
- Sinistres: `/api/sinistres/sinistre_listitems`, `/api/sinistres/sinistre_detail`, `/api/sinistres/sinistre_create`, `/api/sinistres/sinistre_update`
- Tabs: `/api/tabs/Tab_ListItems`, `/api/tabs/Tab_ListValues`, `/api/tabs/Tab_GetValue`
- Risk: `/api/risk/risk_listitems`, `/api/risk/risk_create`, `/api/risk/risk_update`
- Ajout pièce: `POST /api/ajout_piece_au_contrat`

## Pure-return service helpers (used by routes)
- Projects: `src/services/project.service.ts`
- Tabs: `src/services/Tab.services.ts`
- Sinistres: `src/services/sinistre.service.ts`
- Risk: `src/services/risk.service.ts`
- Update Tier: `src/services/update_tier.fastify.service.ts`
- Other SOAP services (detail/liste/create/update) use `BasSecurityContext` and are invoked directly from routes.

## Removed legacy Express handlers
- Risk: `src/routes/risque.routes.ts`, `src/services/Risque.services.ts`
- Update tier: `src/routes/update_tier.routes.ts`, `src/services/update_tier/tiers_update.service.ts`
- Ajout pièce: `src/routes/ajout_piece_au_contrat.routes.ts`
- Express-style handlers in services pruned for: projects, tabs, sinistres

## Express bridge (still present)
- Kept for: `/api/logout`, `/api/admin/*` (and `/debug/*` locally)
- All business endpoints are now native and no longer go through the bridge.

## Next steps
- Optionally remove remaining dead code if any references show up later.
- Keep adding zod validators where missing.
- Consider adding integration tests against Fastify with `fastify.inject` or `supertest(app.server)`.
