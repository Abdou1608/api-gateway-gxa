export interface HasTypename {
  typename?: string;
  // autres props permises
  [k: string]: unknown;
}

export type GroupedByTypename<T> = Record<string, T | T[]> & {
  /** Les éléments sans typename (si keepUnknown=true) */
  Notypename?: T[]; // toujours un tableau pour les "unknown"
};

/** Essaie d’extraire un tableau d’objets depuis diverses formes d’entrée */
function normalizeToArray<T extends HasTypename>(
  input: unknown
): T[] {
  // 1) Déserialiser si string JSON
  let value: unknown = input;
  if (typeof input === 'string') {
    try {
      value = JSON.parse(input);
    } catch {
      return [];
    }
  }

  // 2) Si c’est déjà un tableau
  if (Array.isArray(value)) return value as T[];

  // 3) Si c’est un objet
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;

    // 3.a) Cas "objet direct" avec typename / __typename
    if ('typename' in obj || '__typename' in obj) {
      return [obj as T];
    }

    // 3.b) Cas "objet imbriqué" : chercher une propriété qui est un array d’objets
    const arrayChild = Object.values(obj).find(v => Array.isArray(v));
    if (Array.isArray(arrayChild)) {
      return arrayChild as T[];
    }

    // 3.c) Chercher une propriété qui est un objet avec typename
    const objectChild = Object.values(obj).find(
      v => v && typeof v === 'object' && ('typename' in (v as any) || '__typename' in (v as any))
    );
    if (objectChild && typeof objectChild === 'object') {
      return [objectChild as T];
    }

    // 3.d) Dernier recours : envelopper l’objet lui-même
    return [obj as T];
  }

  // 4) Sinon, rien à traiter
  return [];
}

/**
 * Regroupe les objets par leur typename.
 * - Le 1er élément d'un groupe est stocké directement (objet)
 * - Dès qu'il y a un 2e élément pour le même typename, on convertit en tableau
 * - Pour les éléments sans typename (si keepUnknown=true), on les place dans Produit (toujours un array)
 */
export default function groupByTypename<T extends HasTypename>(
  input: T[] | T | Record<string, unknown> | string,
  opts: { keepUnknown?: boolean } = {}
): GroupedByTypename<T> {
  const { keepUnknown = false } = opts;

  // Normaliser en tableau
  const arr = normalizeToArray<T>(input);

  const result: GroupedByTypename<T> = {};

  for (const item of arr) {
    if (!item || typeof item !== 'object') continue;

    const key =
      (item.typename as string | undefined) ??
      ((item as any).__typename as string | undefined);

    if (!key) {
      if (keepUnknown) {
        if (!Array.isArray(result.Notypename)) result.Notypename = [];
        (result.Notypename as T[]).push(item as T);
      }
      continue;
    }

    const existing = result[key];
    if (existing === undefined) {
      result[key] = item as T;
    } else if (Array.isArray(existing)) {
      existing.push(item as T);
    } else {
      result[key] = [existing as T, item as T];
    }
  }

  return result;
}
