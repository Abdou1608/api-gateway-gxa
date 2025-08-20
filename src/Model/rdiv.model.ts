// rdiv.model.ts

/** Scalar aliases */
export type FtString<N extends number = number> = string;
export type FtInteger = number;
export type FtFloat = number;
export type FtCurrency = number;
export type FtBoolean = boolean;
export type FtDateTime = string; // ISO 8601
export type FtMemo = string;
export type FtSmallint = number;

type DataType =
  | 'ftString'
  | 'ftInteger'
  | 'ftFloat'
  | 'ftCurrency'
  | 'ftBoolean'
  | 'ftDateTime'
  | 'ftMemo'
  | 'ftSmallint';

export interface TagMeta {
  caption: string;
  dataType: DataType;
  nullable: boolean;
  persistent: boolean;
  codeTable?: string;
  calcType?: 'Fixed' | 'Permanent';
}

export type FieldTagMap<T> = { [K in keyof T]-?: TagMeta };

/** Modèle issu de <rdiv><data>… */
export interface Rdiv {
  /** risque associé */
  risque: FtInteger; // not null, persistent

  /** N° risque divers */
  numdiv?: FtInteger; // nullable, persistent

  /** description générale */
  descrip?: FtMemo; // nullable, persistent
}

/** Métadonnées des champs (fieldTagMap) */
export const RdivFieldTags: FieldTagMap<Rdiv> = {
  risque:  { caption: 'risque associé',      dataType: 'ftInteger', nullable: false, persistent: true },
  numdiv:  { caption: 'N° risque divers',    dataType: 'ftInteger', nullable: true,  persistent: true },
  descrip: { caption: 'description générale', dataType: 'ftMemo',   nullable: true,  persistent: true },
};

/** Fabrique un objet avec valeurs par défaut */
export const createRdiv = (init?: Partial<Rdiv>): Rdiv => ({
  risque: 0,
  ...init,
});
