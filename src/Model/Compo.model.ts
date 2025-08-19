// path: src/app/models/compo.model.ts

/**
 * Modèle généré depuis <compo><data>...</data></compo>.
 * Même mise en forme que le modèle "Clause".
 * Pourquoi ce fichier est autonome : évite les imports circulaires tant que les modèles ne sont pas factorisés.
 */

export type DataType =
  | 'ftString'
  | 'ftInteger'
  | 'ftFloat'
  | 'ftCurrency'
  | 'ftMemo'
  | 'ftBoolean';

export interface FieldTag {
  caption: string;
  dataType: DataType;
  length?: number;   // pour ftString(n)
  nullable: boolean;
  persistent: boolean;
  codeTable?: string;
}

/** Données du nœud <data> */
export interface CompoData {
  /** N° option garantie — non nullable */
  numopt: number;
  /** code compagnie — non nullable */
  cie: number;

  /** code produit compagnie (11) */
  prodcie: string | null;

  /** taux (Float) */
  taux: number | null;

  /** nom compagnie (30) — Persistent: false (calc) */
  nomcie: string | null;
}

/** Enveloppe conforme au XML racine */
export interface Compo {
  data: CompoData;
}

/** Métadonnées par champ (d’après les commentaires du XML) */
export const CompoFieldTagMap: Record<keyof CompoData, FieldTag> = {
  numopt:  { caption: 'N° option garantie',     dataType: 'ftInteger',              nullable: false, persistent: true  },
  cie:     { caption: 'code compagnie',         dataType: 'ftInteger',              nullable: false, persistent: true  },
  prodcie: { caption: 'code produit compagnie', dataType: 'ftString', length: 11,   nullable: true,  persistent: true  },
  taux:    { caption: 'taux',                   dataType: 'ftFloat',                nullable: true,  persistent: true  },
  nomcie:  { caption: 'nom compagnie',          dataType: 'ftString', length: 30,   nullable: true,  persistent: false },
};
