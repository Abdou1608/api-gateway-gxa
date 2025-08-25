// proposition.model.ts

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

/** Modèle issu de <Proposition><data>… */
export interface Proposition {
  /** code interne */
  code: FtInteger; // not null, persistent

  /** rubrique */
  rub?: FtString;

  /** Proposition */
  propos?: FtInteger;

  /** nom proposition */
  nom_prop?: FtString;

  /** Ordre d'affichage */
  ordre?: FtInteger;

  /** description */
  descrip?: FtMemo;

  /** code produit */
  prod?: FtString;

  /** Fractionnements */
  lfrac?: FtString;

  /** Bordereau bidon */
  borderea?: FtInteger;

  /** Formule frais bordereau (code table FRAIS) */
  frais?: FtString;

  /** Classeur devis détail */
  classeur?: FtInteger;

  /** Lettre devis détail */
  lettre?: FtInteger;
}

/** fieldTagMap (métadonnées pour chaque propriété) */
export const PropositionFieldTags: FieldTagMap<Proposition> = {
  code:     { caption: 'code interne', dataType: 'ftInteger', nullable: false, persistent: true },
  rub:      { caption: 'rubrique', dataType: 'ftString', nullable: true, persistent: true },
  propos:   { caption: 'Proposition', dataType: 'ftInteger', nullable: true, persistent: true },
  nom_prop: { caption: 'nom proposition', dataType: 'ftString', nullable: true, persistent: true },
  ordre:    { caption: "Ordre d'affichage", dataType: 'ftInteger', nullable: true, persistent: true },
  descrip:  { caption: 'description', dataType: 'ftMemo', nullable: true, persistent: true },
  prod:     { caption: 'code produit', dataType: 'ftString', nullable: true, persistent: true },
  lfrac:    { caption: 'Fractionnements', dataType: 'ftString', nullable: true, persistent: true },
  borderea: { caption: 'Bordereau bidon', dataType: 'ftInteger', nullable: true, persistent: true },
  frais:    { caption: 'Formule frais bordereau', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'FRAIS' },
  classeur: { caption: 'Classeur devis détail', dataType: 'ftInteger', nullable: true, persistent: true },
  lettre:   { caption: 'Lettre devis détail', dataType: 'ftInteger', nullable: true, persistent: true },
};

/** Fabrique un objet avec valeurs par défaut */
export const createProposition = (init?: Partial<Proposition>): Proposition => ({
  code: 0,
  ...init,
});
