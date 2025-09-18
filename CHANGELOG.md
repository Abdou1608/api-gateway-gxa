# Changelog

## Unreleased
### Added
- Injection automatique de `BasSecurityContext._SessionId` par le `authMiddleware` à partir de `req.auth.sid` (JWT) pour compatibilité.
- Tests d'intégration confirmant qu'un corps sans `BasSecurityContext` fonctionne avec un Bearer valide.

### Changed
- Source d'autorité du Session ID: le JWT (champ `sid`). Les valeurs fournies dans le body sont ignorées si différentes.

### Deprecated (phase de transition)
- Usage explicite de `BasSecurityContext` dans les validateurs: sera supprimé (Option A) dans une prochaine version. Les clients peuvent déjà cesser d'envoyer cet objet.

### Security
- Rappel: définir `JWS_KEY` (>=32 chars) en production, ne pas logger les tokens.
