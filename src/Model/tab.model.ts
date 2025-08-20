// tab.model.ts

/** Scalar aliases (mappage “FT*” -> TS) */
export type FtString<N extends number = number> = string;
export type FtInteger = number;
export type FtFloat = number;
export type FtCurrency = number;
export type FtBoolean = boolean;
export type FtDateTime = string; // ISO 8601
export type FtMemo = string;
export type FtSmallint = number;

/** Métadonnées de champ (issues des commentaires XML) */
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
  calcType?:
    | 'Fixed'
    | 'Permanent'
    | 'On every input'
    | 'On input when empty'
    | 'On save when empty';
}

export type FieldTagMap<T> = { [K in keyof T]-?: TagMeta };

/** Modèle issu de <tab><data>… */
export interface Tab {
  /** code table */
  tabcode: FtString; // not null, persistent

  /** code référence */
  tabref: FtString; // not null, persistent

  /** valeur */
  tabval?: FtString;

  /** valeur affichée */
  tabaff?: FtString;

  /** Valeur et référence */
  valref?: FtString;
}

/** fieldTagMap (métadonnées pour chaque propriété) */
export const TabFieldTags: FieldTagMap<Tab> = {
  tabcode: { caption: 'code table', dataType: 'ftString', nullable: false, persistent: true },
  tabref:  { caption: 'code référence', dataType: 'ftString', nullable: false, persistent: true },
  tabval:  { caption: 'valeur', dataType: 'ftString', nullable: true, persistent: true },
  tabaff:  { caption: 'valeur affichée', dataType: 'ftString', nullable: true, persistent: true },
  valref:  { caption: 'Valeur et référence', dataType: 'ftString', nullable: true, persistent: true },
};

/** Fabrique un objet avec valeurs par défaut */
export const createTab = (init?: Partial<Tab>): Tab => ({
  tabcode: '',
  tabref: '',
  ...init,
});
