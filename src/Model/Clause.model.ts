// path: src/app/models/clause.model.ts

/**
 * Modèle généré depuis le XML <clause><data>...</data></clause>.
 * Le fieldTagMap reflète fidèlement les commentaires du XML.
 */

export type DataType = 'ftString' | 'ftInteger' | 'ftMemo' | 'ftDateTime';

export interface FieldTag {
  caption: string;
  dataType: DataType;
  length?: number;        // pour ftString(n)
  nullable: boolean;
  persistent: boolean;
  codeTable?: string;     // si un jour présent dans le XML
}

/** Données internes du nœud <data> */
export interface ClauseData {
  /** code produit lié (9) — non nullable */
  codeprod: string;
  /** code clause (6) — non nullable */
  clause: string;
  /** N° ordre — non nullable */
  ordre: number;
  /** libelle clause (50) */
  libelle: string | null;
  /** texte (Memo) */
  texte: string | null;
  /** Date expiration / remplacement (DateTime) */
  datefin: string | Date | null; // ISO string côté API, Date côté UI
}

/** Enveloppe conforme au XML racine */
export interface Clause {
  data: ClauseData;
}

/** Métadonnées par champ (d’après les commentaires du XML) */
export const ClauseFieldTagMap: Record<keyof ClauseData, FieldTag> = {
  codeprod: { caption: 'code produit lié',             dataType: 'ftString',  length: 9,  nullable: false, persistent: true },
  clause:   { caption: 'code clause',                  dataType: 'ftString',  length: 6,  nullable: false, persistent: true },
  ordre:    { caption: 'N° ordre',                     dataType: 'ftInteger',                nullable: false, persistent: true },
  libelle:  { caption: 'libelle clause',               dataType: 'ftString',  length: 50, nullable: true,  persistent: true },
  texte:    { caption: 'texte',                        dataType: 'ftMemo',                   nullable: true,  persistent: true },
  datefin:  { caption: 'Date expiration / remplacement', dataType: 'ftDateTime',            nullable: true,  persistent: true },
};
