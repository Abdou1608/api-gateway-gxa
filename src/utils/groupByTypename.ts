// src/utils/groupByTypename.ts

export interface HasTypename {
    typename?: string;
    // autres props permises
    [k: string]: unknown;
  }
  
 

  export type GroupedByTypename<T> = Record<string, T | T[]> & {
    /** Les éléments sans typename (si keepUnknown=true) */
    Produit?: T[]; // toujours un tableau pour les "unknown"
  };
  
  /**
   * Regroupe par `typename` les objets d'une réponse.
   *
   * - `typename` unique  -> valeur = l'objet lui-même
   * - `typename` multiple-> valeur = T[]
   * - si opts.keepUnknown = true, les éléments sans typename vont dans `_unknown`
  
  export default function groupByTypename<T extends HasTypename>(
    input: T[] | string,
    opts?: { keepUnknown?: boolean }
  ): GroupedByTypename<T> {
    const keepUnknown = !!opts?.keepUnknown;
  
    let arr: T[];
    if (typeof input === 'string') {
      let parsed: unknown;
      try {
        parsed = JSON.parse(input);
      } catch {
        throw new Error('JSON invalide fourni à groupByTypename.');
      }
      if (!Array.isArray(parsed)) {
        throw new Error('La chaîne JSON ne représente pas un tableau.');
      }
      arr = parsed as T[];
    } else if (Array.isArray(input)) {
      arr = input;
    } else {
      throw new Error('groupByTypename attend un tableau ou une chaîne JSON.');
    }
  
    const result: GroupedByTypename<T> = {};
  
    for (const item of arr) {
      if (!item || typeof item !== 'object') continue;
  
      const key = (item as HasTypename).typename;
      if (typeof key !== 'string' || key.trim() === '') {
        if (keepUnknown) {
          (result._unknown ??= []).push(item as T);
        }
        continue;
      }
  
      if (result[key] === undefined) {
        result[key] = item as T;
      } else if (Array.isArray(result[key])) {
        (result[key] as T[]).push(item as T);
      } else {
        result[key] = [result[key] as T, item as T];
      }
    }
  
    return result;
  }
   */
  // Types utilitaires (adapte si tu les as déjà ailleurs)
export interface HasTypename {
  typename?: string | undefined;
}



export default function groupByTypename<T extends HasTypename>(
  input: T[] | string,
  opts: { keepUnknown?: boolean } = {}
): GroupedByTypename<T> {
  const { keepUnknown = false } = opts;

  // 1) Normaliser l'entrée en tableau T[]
  let arr: T[];
  if (typeof input === 'string') {
    let parsed: unknown;
    try {
      parsed = JSON.parse(input);
    } catch {
      throw new Error('JSON invalide fourni à groupByTypename.');
    }
    if (!Array.isArray(parsed)) {
      throw new Error('La chaîne JSON ne représente pas un tableau.');
    }
    arr = parsed as T[];
  } else if (Array.isArray(input)) {
    arr = input;
  } else {
    throw new Error('groupByTypename attend un tableau ou une chaîne JSON.');
  }

  // 2) Réduction
  const result: GroupedByTypename<T> = {};

  for (const item of arr) {
    if (!item || typeof item !== 'object') continue;

    const rawKey = (item as HasTypename).typename;
    const key = (typeof rawKey === 'string' ? rawKey.trim() : '');

    if (!key) {
      // Pas de typename
      if (keepUnknown) {
        if (!Array.isArray(result.Produit)) result.Produit = [];
        result.Produit.push(item as T);
      }
      continue;
    }

    const existing = result[key];

    if (existing === undefined) {
      // 1er élément pour ce typename → on stocke l'objet lui-même
      result[key] = item as T;
    } else if (Array.isArray(existing)) {
      // Déjà un tableau → on empile
      existing.push(item as T);
    } else {
      // Était un objet unique → on convertit en tableau
      result[key] = [existing as T, item as T];
    }
  }

  return result;
}
