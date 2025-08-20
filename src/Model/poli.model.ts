// poli.model.ts

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

/** Modèle issu de <poli><data>… */
export interface Poli {
  /** N° contrat */
  contrat: FtInteger; // not null, persistent

  /** N° pièce */
  piece: FtInteger; // not null, persistent

  /** code compagnie */
  cie: FtInteger; // not null, persistent

  /** N° police */
  police?: FtString<35>; // nullable, persistent

  /** cout police */
  coutpol?: FtCurrency; // nullable, persistent

  /** cout police (ISO 4217 currency code) */
  coutpol1?: FtString<3>; // nullable, persistent

  /** taux participation */
  tauxpart?: FtFloat; // nullable, persistent

  /** Type de police */
  role?: FtString<1>; // nullable, persistent, code table POLIROLE

  /** taux comm. sur PN */
  tauxcom?: FtFloat; // nullable, persistent

  /** Taux sur CatNat */
  tauxcn?: FtFloat; // nullable, persistent

  /** taux comm. sur coût police */
  tauxcout?: FtFloat; // nullable, persistent

  /** Cie destinataire des primes */
  cieprime?: FtInteger; // nullable, persistent

  /** Cies destinataire des taxes */
  cietaxes?: FtInteger; // nullable, persistent

  /** % commission supplémentaire */
  commsup?: FtFloat; // nullable, persistent

  /** Numéro Police Groupe */
  polgroupe?: FtString<25>; // nullable, persistent

  /** Référence à la compagnie */
  reference?: FtString<20>; // nullable, persistent
}

/** Métadonnées des champs (fieldTagMap) */
export const PoliFieldTags: FieldTagMap<Poli> = {
  contrat:   { caption: 'N° contrat',                       dataType: 'ftInteger',  nullable: false, persistent: true },
  piece:     { caption: 'N° pièce',                         dataType: 'ftInteger',  nullable: false, persistent: true },
  cie:       { caption: 'code compagnie',                   dataType: 'ftInteger',  nullable: false, persistent: true },
  police:    { caption: 'N° police',                        dataType: 'ftString',   nullable: true,  persistent: true },
  coutpol:   { caption: 'cout police',                      dataType: 'ftCurrency', nullable: true,  persistent: true },
  coutpol1:  { caption: 'cout police (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
  tauxpart:  { caption: 'taux participation',               dataType: 'ftFloat',    nullable: true,  persistent: true },
  role:      { caption: 'Type de police',                   dataType: 'ftString',   nullable: true,  persistent: true, codeTable: 'POLIROLE' },
  tauxcom:   { caption: 'taux comm. sur PN',                dataType: 'ftFloat',    nullable: true,  persistent: true },
  tauxcn:    { caption: 'Taux sur CatNat',                  dataType: 'ftFloat',    nullable: true,  persistent: true },
  tauxcout:  { caption: 'taux comm. sur coût police',       dataType: 'ftFloat',    nullable: true,  persistent: true },
  cieprime:  { caption: 'Cie destinataire des primes',      dataType: 'ftInteger',  nullable: true,  persistent: true },
  cietaxes:  { caption: 'Cies destinataire des taxes',      dataType: 'ftInteger',  nullable: true,  persistent: true },
  commsup:   { caption: '% commission supplémentaire',      dataType: 'ftFloat',    nullable: true,  persistent: true },
  polgroupe: { caption: 'Numéro Police Groupe',             dataType: 'ftString',   nullable: true,  persistent: true },
  reference: { caption: 'Référence à la compagnie',         dataType: 'ftString',   nullable: true,  persistent: true },
};

/** Fabrique un objet avec valeurs par défaut */
export const createPoli = (init?: Partial<Poli>): Poli => ({
  contrat: 0,
  piece: 0,
  cie: 0,
  ...init,
});
