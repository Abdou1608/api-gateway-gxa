# Types API générés

Le fichier `src/types/api.ts` est généré automatiquement à partir de `openapi.fr.ex.custom.yaml`.

## Génération

```bash
npm run gen:types
```

## Limitations du générateur simple
- Ne gère pas `oneOf` / `anyOf` / `discriminator`.
- `allOf` est converti en extension d'interfaces existantes mais ignore les parties inline complexes.
- Les propriétés sans type explicite sont typées `any`.
- Les références circulaires ne sont pas détectées.

Pour un générateur robuste, envisager `openapi-typescript` ou `openapi-generator-cli`.

## Bonnes pratiques
- Maintenir la spec OpenAPI la plus simple possible (objets plats) pour maximiser la qualité des types émis.
- Ajouter un job CI qui échoue si `api.ts` n'est pas à jour (diff git après génération).
