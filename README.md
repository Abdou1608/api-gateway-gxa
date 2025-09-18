## Exécution rapide

### Express
Compilation TypeScript puis lancement :

```
npm run build
npm start
```

Ou en mode dev (reload):

```
npm run dev
```

Endpoints principaux:
- `GET /health` : statut
- `GET /openapi.json` : spec OpenAPI fusionnée
- `GET /docs` : UI Swagger
 
### Endpoints métiers (extraits)

Contrats / Tiers:
- `POST /api/liste_des_contrats`
- `POST /api/detail_contrat`
- `POST /api/Tiers_Search`

Quittances / Règlements:
- `POST /api/create_quittance`
- `POST /api/create_reglement`

Projects:
- `POST /api/projects/create`
- `POST /api/projects/detail`
- `POST /api/projects/add-offer`
- `POST /api/projects/delete-offer`
- `POST /api/projects/list-items`
- `POST /api/projects/offer-list-items`
- `POST /api/projects/update`
- `POST /api/projects/validate-offer`

Authentification:
- `POST /api/login` (public)
- `POST /api/logout` (public)
- `GET /api/profile` (JWT requis)

### Fastify (serveur parallèle)

```
node dist/fastify-server.js # après build
```
ou directement TypeScript (si ts-node-dev installé globalement) :
```
ts-node src/fastify-server.ts
```

Endpoints Fastify:
- `GET /health` : statut (inclut `engine: fastify`)
- `GET /docs-fastify` : UI Swagger Fastify

### Personnalisation OpenAPI

Placez/éditez un des fichiers:
- `openapi.fr.ex.custom.yaml`
- `src/middleware/openapi.yaml`

Le builder `buildOpenApiDoc()` fusionne ces chemins et ajoute /health et /login si absents.

### Génération des types TypeScript à partir d'OpenAPI

Un script simple extrait `components.schemas` et génère `src/types/api.ts`.

Exécuter:
```
npm run gen:types
```
Sortie: `src/types/api.ts` (ne pas éditer à la main). Si vous modifiez `openapi.fr.ex.custom.yaml`, regénérez les types.

Limitations actuelles du générateur:
- Support basique des objets / propriétés / required / arrays.
- `$ref` résolus seulement au premier niveau des propriétés.
- Pas de gestion avancée de `oneOf` / `anyOf` / discriminators.
- `allOf` partiellement supporté (fusion superficielle).

Améliorations possibles:
- Mapper les formats (`date-time`) vers `string & { __brand: 'DateTime' }`.
- Générer des types d'énumération si `enum:` présent.
- Générer des helpers Zod ou Ajv pour validation runtime.

### Migration Express -> Fastify
Utilisez les deux serveurs en parallèle pour comparer réponses.

# SOAP REST Gateway (Node.js + TypeScript)

Ce projet expose une API REST pour chacune des fonctionnalités listées dans un tableau Excel, et traduit dynamiquement les requêtes vers un serveur SOAP.

## 🚀 Installation

```bash
npm install
```

## 🛠️ Démarrage en développement

```bash
npm run dev
```

## 🧪 Build production

```bash
npm run build
npm start
```

## 🔧 Configuration via `.env`

```env
SOAP_ENDPOINT=http://example.com/soap
PORT=3000
```

## 📁 Structure

- `/src/routes/` — Toutes les routes REST
- `/src/services/soap.service.ts` — Communication avec le serveur SOAP
- `/src/middleware/logger.middleware.ts` — Middleware de logging
- `/src/utils/xml-parser.ts` — Conversion XML -> JSON

## 🔐 Sécurité / Auth

Schéma `bearerAuth` (JWT) défini dans l'OpenAPI. Les endpoints publics sont marqués avec `security: []`. Les autres héritent de la sécurité globale.

### Normalisation du Session ID (SID)

Depuis l'introduction du middleware JWT (`authMiddleware`), la source d'autorité unique du SID est le token décodé (`req.auth.sid`).

Compatibilité (Option B active):
- Si le client n'envoie plus `BasSecurityContext` ni `SessionID`, le middleware injecte automatiquement `req.body.BasSecurityContext._SessionId` avec la valeur du SID.
- Les anciens champs (`SessionID`, `_SessionID`, `sessionId`, `_sessionId`) sont aussi auto-renseignés si absents.

Implications:
- Les validateurs n'ont plus besoin d'exiger que le client fournisse `BasSecurityContext._SessionId` (nettoyage progressif en cours).
- Le client ne doit pas faire confiance à une valeur saisie coté utilisateur: toute valeur fournie est ignorée si le JWT dit autre chose.
- Prochaine étape (Option A future): supprimer totalement `BasSecurityContext` des schémas pour simplifier la surface publique.

Bonnes pratiques:
- Toujours envoyer `Authorization: Bearer <token>` sur les routes protégées.
- Ne pas logger le token ni le SID en production.
- Clé `JWS_KEY` >= 32 chars (aléatoire) obligatoire côté serveur.

État de migration: phase de transition – compatibilité maintenue, suppression future annoncée dans CHANGELOG.

### Révocation de token (Denylist en mémoire)

Deux fonctions disponibles dans `src/auth/token-revocation.service.ts` :

- `invalidateToken(token: string): Promise<void>` ajoute le JWT (par `jti` si présent, sinon hash SHA-256) dans une denylist avec son `exp`.
- `isTokenRevoked(token: string): Promise<boolean>` retourne `true` si le token est encore listé et non expiré.

Implémentation:
- Stockage en mémoire (Map) avec nettoyage paresseux (intervalle ~60s).
- Fallback TTL 5 min si le token ne contient pas `exp`.
- TODO présent dans le code pour brancher Redis en environnement distribué.

Intégration route `profile` (voir `src/routes/profile.routes.ts`):
- Vérification initiale: si `isTokenRevoked(...)` => 401.
- Après récupération du profil: si résultat vide ou erreur => `invalidateToken` + logout de la session (SID) => 401.
- Lignes clés: pré-check juste après l'entrée handler (~15+), logique post-fetch juste avant l'envoi de la réponse.

## 🧼 Erreurs standardisées

Réponses communes:
- 400: `ValidationErrorResponse`
- 401: `ErrorResponse` (auth manquante ou invalide)
- 500: `SoapFaultError` (détails SOAP dans `details.state`, `details.errorCode`...)

## 🧩 Ajout d'un nouvel endpoint
1. Ajouter la route (Express ou Fastify) dans `src/routes`.
2. Documenter dans `openapi.fr.ex.custom.yaml` (paths + schémas d'entrée/sortie si nouveaux).
3. Lancer `npm run gen:types`.
4. Utiliser les interfaces générées dans vos handlers (`import { NouveauSchemaInput } from './types/api'`).

## 🧪 Tests (à compléter)
Proposer des tests d'intégration pour chaque endpoint critique + tests unitaires pour le parsing des fautes SOAP.

## 🗺️ Roadmap courte
- [ ] Générateur de types: support enums / oneOf.
- [ ] Middleware unifié de mapping SOAP -> erreurs HTTP.
- [ ] Tests d'intégration.
- [ ] Linter OpenAPI (spectral) CI.
