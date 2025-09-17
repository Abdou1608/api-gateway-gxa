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
 * Regroupe les objets par leur typename.
 * - Le 1er élément d'un groupe est stocké directement (objet)
 * - Dès qu'il y a un 2e élément pour le même typename, on convertit en tableau
 * - Pour les éléments sans typename (si keepUnknown=true), on les place dans Produit (toujours un array)
 */
export default function groupByTypename<T extends HasTypename>(
  input: T[] | string,
  opts: { keepUnknown?: boolean } = {}
): GroupedByTypename<T> {
  const { keepUnknown = false } = opts;

  // 1) Normaliser l'entrée en tableau T[]
  let arr: T[];
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        arr = parsed as T[];
      } else if (parsed && typeof parsed === 'object') {
        arr = [parsed as T];
      } else {
        arr = [];
      }
    } catch {
      arr = [];
    }
  } else {
    arr = input;
  }

  // 2) Réduction
  const result: GroupedByTypename<T> = {};

  for (const item of arr) {
    if (!item || typeof item !== 'object') continue;

    const key = (item.typename ?? (item as any).__typename) as string | undefined;

    if (!key) {
      // Pas de typename
      if (keepUnknown) {
        if (!Array.isArray(result.Produit)) result.Produit = [];
        (result.Produit as T[]).push(item as T);
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