# Gestion d'erreurs centralisée (API Gateway)

Cette passerelle unifie tous les retours d'erreurs en un schéma JSON unique et documenté.

## Schéma de réponse

{
  "error": {
  "type": "SOAP_ERROR | AUTH_ERROR | VALIDATION_ERROR | TRANSFORM_ERROR | UPSTREAM_TIMEOUT | NETWORK_ERROR | INTERNAL_ERROR",
    "code": "string",
    "message": "string",
    "details": { "…": "…", "soapFault?": { "faultcode": "...", "faultstring": "...", "detail": {"…": "…"} } },
    "requestId": "uuid",
    "timestamp": "ISO-8601"
  }
}

- type: catégorie d'erreur stable
- code: code fonctionnel stable (ex: VALIDATION.INVALID_BODY, SOAP.FAULT, UPSTREAM.TIMEOUT)
- details: informations additionnelles sécurisées (jamais de secrets)
- requestId: identifiant de corrélation (X-Request-Id), recopié dans les logs et en-têtes

## Hiérarchie d'exceptions

- BaseAppError
  - SoapServerError (details.soapFault)
  - AuthError
  - ValidationError
  - TransformError
  - UpstreamTimeoutError
  - NetworkError
  - InternalError

Utiliser ces classes au lieu de `throw new Error()`.

## Mapping HTTP

- AUTH_ERROR → 401
- VALIDATION_ERROR → 400
- SOAP_ERROR → 502 (peut être affiné)
- UPSTREAM_TIMEOUT → 504
- NETWORK_ERROR → 502
- TRANSFORM_ERROR → 500
- INTERNAL_ERROR → 500

## Middleware global

- `requestIdMiddleware`: génère ou propage `X-Request-Id`
- `errorHandler`: formate l'erreur selon le schéma et ajoute des en-têtes d'observabilité (`X-Error-Type`, `X-Error-Code`, `X-SOAP-FAULT` si applicable)

## Détection SOAP Fault

`utils/soap-fault-handler.ts`
- `BasSoapFault.IsBasError(xml)` puis `ParseBasErrorDetailed(xml)`
- Mappé en `SoapServerError` avec `details.soapFault`

## Bonnes pratiques

- Ne pas intercepter localement sauf pour enrichir puis relancer une erreur typée.
- Validation: lever `ValidationError`.
- Transformations/parsing: `TransformError`.
- Upstream timeout: `UpstreamTimeoutError`.
- Pas de `.catch(... res.status(...))` dans les routes/services; laisser le handler global répondre.

## En-têtes d’erreur (observabilité)

Le middleware d’erreurs ajoute des en-têtes pour faciliter le diagnostic côté clients et observabilité:

- `X-Error-Type`: la catégorie de l’erreur (ex: `AUTH_ERROR`, `SOAP_ERROR`, …)
- `X-Error-Code`: le code fonctionnel stable (ex: `AUTH.UNAUTHORIZED`, `SOAP.FAULT`)
- `X-SOAP-FAULT`: présent et égal à `1` si l’erreur provient d’une faute SOAP (SoapServerError)

Notes:
- Ces en-têtes ne contiennent pas d’informations sensibles.
- Utilisez-les dans les logs front-end et corrélez avec `error.requestId` pour des traces bout-en-bout.

## Exemples

Validation:
{
  "error": {
    "type": "VALIDATION_ERROR",
    "code": "VALIDATION.INVALID_BODY",
    "message": "Le corps de la requête est invalide.",
    "details": { "issues": [{"path": "field", "message": "required"}] },
    "requestId": "...",
    "timestamp": "..."
  }
}

SOAP Fault:
{
  "error": {
    "type": "SOAP_ERROR",
    "code": "SOAP.FAULT",
    "message": "Faulted",
    "details": { "soapFault": { "faultcode": "Client", "faultstring": "..." } },
    "requestId": "...",
    "timestamp": "..."
  }
}

Unauthorized (AUTH_ERROR):
{
  "error": {
    "type": "AUTH_ERROR",
    "code": "AUTH.UNAUTHORIZED",
    "message": "Unauthorized",
    "details": { "reason": "empty profile" },
    "requestId": "...",
    "timestamp": "..."
  }
}
