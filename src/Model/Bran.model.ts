// path: src/app/models/bran.model.ts

/**
 * Modèle généré depuis le XML <bran><data>...</data></bran>.
 * Pourquoi ce format : garder un "fieldTagMap" aligné sur les commentaires XML
 * pour outiller la validation, les formulaires dynamiques et la doc runtime.
 */

/** Types de données vus dans les commentaires du XML */
export type DataType =
  | 'ftString'
  | 'ftSmallint'
  | 'ftBoolean'
  | 'ftMemo';

/** Métadonnées d’un champ issues des commentaires XML */
export interface FieldTag {
  caption: string;
  dataType: DataType;
  /** Longueur quand ftString(n) */
  length?: number;
  nullable: boolean;
  persistent: boolean;
  /** Table de codes si présente dans le XML */
  codeTable?: string;
}

/** Données portées par <data> … </data> (nullables selon "Nullable:") */
export interface BranData {
  /** type de risque (2) — non nullable */
  branche: string;
  /** Libellé (31) */
  libelle: string | null;
  /** Nombre personne(s) (Smallint) */
  nbredpp: number | null;
  /** Véhicule (0 ou 1) (Smallint) */
  nbreveh: number | null;
  /** immeuble (0 ou 1) (Smallint) */
  nbreimm: number | null;
  /** divers (0 ou 1) (Smallint) */
  nbrediv: number | null;
  /** Avec adhésion multiple (Boolean) */
  multiadh: boolean | null;
  /** extension(s) fixe(s) (Memo) */
  extfixe: string | null;
  /** Extension(s) obligatoire(s) (Memo) */
  extobli: string | null;
  /** Extension(s) disponible(s) (Memo) */
  extdispo: string | null;
  /** Avec gestion couvertures (Boolean) */
  aveccouv: boolean | null;
  /** Garanties Risque / Personne (1) */
  garlien: string | null;
}

/** Enveloppe correspondant au XML racine */
export interface Bran {
  data: BranData;
}

/** Map des métadonnées (captions, types, nullabilité, etc.) */
export const BranFieldTagMap: Record<keyof BranData, FieldTag> = {
  branche:  { caption: 'type de risque',            dataType: 'ftString',  length: 2,  nullable: false, persistent: true },
  libelle:  { caption: 'Libellé',                   dataType: 'ftString',  length: 31, nullable: true,  persistent: true },
  nbredpp:  { caption: 'Nombre personne(s)',        dataType: 'ftSmallint',               nullable: true,  persistent: true },
  nbreveh:  { caption: 'Véhicule (0 ou 1)',         dataType: 'ftSmallint',               nullable: true,  persistent: true },
  nbreimm:  { caption: 'immeuble (0 ou 1)',         dataType: 'ftSmallint',               nullable: true,  persistent: true },
  nbrediv:  { caption: 'divers (0 ou 1)',           dataType: 'ftSmallint',               nullable: true,  persistent: true },
  multiadh: { caption: 'Avec adhésion multiple',    dataType: 'ftBoolean',                nullable: true,  persistent: true },
  extfixe:  { caption: 'extension(s) fixe(s)',      dataType: 'ftMemo',                   nullable: true,  persistent: true },
  extobli:  { caption: 'Extension(s) obligatoire(s)', dataType: 'ftMemo',                 nullable: true,  persistent: true },
  extdispo: { caption: 'Extension(s) disponible(s)', dataType: 'ftMemo',                  nullable: true,  persistent: true },
  aveccouv: { caption: 'Avec gestion couvertures',  dataType: 'ftBoolean',                nullable: true,  persistent: true },
  garlien:  { caption: 'Garanties Risque / Personne', dataType: 'ftString', length: 1,   nullable: true,  persistent: true },
};
