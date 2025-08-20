// pbg.model.ts

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

/** Métadonnées extraites des commentaires */
export interface TagMeta {
  caption: string;
  dataType: DataType;
  nullable: boolean;
  persistent: boolean;
  codeTable?: string;
  calcType?: 'Fixed' | 'Permanent';
}

/** Mappe chaque champ du modèle à ses métadonnées */
export type FieldTagMap<T> = { [K in keyof T]-?: TagMeta };

/** Modèle issu de <pbg><data>… */
export interface Pbg {
  /** risque */
  risque: FtInteger; // not null, persistent

  /** option garantie */
  option: FtInteger; // not null, persistent

  /** prime nette */
  pn?: FtCurrency; // nullable, persistent

  /** prime nette (ISO 4217 currency code) */
  pn1?: FtString<3>; // nullable, persistent

  /** code catnat */
  ccn?: FtSmallint; // nullable, persistent

  /** taux catnat */
  xcn?: FtFloat; // nullable, persistent

  /** Montant Cat/nat */
  cn?: FtCurrency; // nullable, persistent

  /** Montant Cat/nat (ISO 4217 currency code) */
  cn1?: FtString<3>; // nullable, persistent

  /** taux comm/pn */
  xcompn?: FtFloat; // nullable, persistent

  /** taux comm/cn */
  xcomcn?: FtFloat; // nullable, persistent

  /** Montant commission */
  comm?: FtCurrency; // nullable, persistent

  /** Montant commission (ISO 4217 currency code) */
  comm1?: FtString<3>; // nullable, persistent

  /** code taxe */
  ctaxe?: FtInteger; // nullable, persistent

  /** Taux de taxe */
  xtaxe?: FtFloat; // nullable, persistent

  /** Montant taxe */
  taxe?: FtCurrency; // nullable, persistent

  /** Montant taxe (ISO 4217 currency code) */
  taxe1?: FtString<3>; // nullable, persistent

  /** Variation (indice, bonus) */
  valvar?: FtFloat; // nullable, persistent

  /** Taux revalo à appliquer */
  txreval?: FtFloat; // nullable, persistent

  /** Code taxe sur CN */
  ctxcn?: FtSmallint; // nullable, persistent

  /** Taux de taxe sur CN */
  xtxcn?: FtFloat; // nullable, persistent

  /** Prime nette achetée */
  primeachat?: FtCurrency; // nullable, persistent

  /** Prime nette achetée (ISO 4217 currency code) */
  primeachat1?: FtString<3>; // nullable, persistent
}

/** Métadonnées des champs (fieldTagMap) */
export const PbgFieldTags: FieldTagMap<Pbg> = {
  risque:       { caption: 'risque',                               dataType: 'ftInteger',  nullable: false, persistent: true },
  option:       { caption: 'option garantie',                       dataType: 'ftInteger',  nullable: false, persistent: true },
  pn:           { caption: 'prime nette',                           dataType: 'ftCurrency', nullable: true,  persistent: true },
  pn1:          { caption: 'prime nette (ISO 4217 currency code)',  dataType: 'ftString',   nullable: true,  persistent: true },
  ccn:          { caption: 'code catnat',                           dataType: 'ftSmallint', nullable: true,  persistent: true },
  xcn:          { caption: 'taux catnat',                           dataType: 'ftFloat',    nullable: true,  persistent: true },
  cn:           { caption: 'Montant Cat/nat',                       dataType: 'ftCurrency', nullable: true,  persistent: true },
  cn1:          { caption: 'Montant Cat/nat (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
  xcompn:       { caption: 'taux comm/pn',                          dataType: 'ftFloat',    nullable: true,  persistent: true },
  xcomcn:       { caption: 'taux comm/cn',                          dataType: 'ftFloat',    nullable: true,  persistent: true },
  comm:         { caption: 'Montant commission',                    dataType: 'ftCurrency', nullable: true,  persistent: true },
  comm1:        { caption: 'Montant commission (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
  ctaxe:        { caption: 'code taxe',                             dataType: 'ftInteger',  nullable: true,  persistent: true },
  xtaxe:        { caption: 'Taux de taxe',                          dataType: 'ftFloat',    nullable: true,  persistent: true },
  taxe:         { caption: 'Montant taxe',                          dataType: 'ftCurrency', nullable: true,  persistent: true },
  taxe1:        { caption: 'Montant taxe (ISO 4217 currency code)', dataType: 'ftString',   nullable: true,  persistent: true },
  valvar:       { caption: 'Variation (indice, bonus)',             dataType: 'ftFloat',    nullable: true,  persistent: true },
  txreval:      { caption: 'Taux revalo à appliquer',               dataType: 'ftFloat',    nullable: true,  persistent: true },
  ctxcn:        { caption: 'Code taxe sur CN',                      dataType: 'ftSmallint', nullable: true,  persistent: true },
  xtxcn:        { caption: 'Taux de taxe sur CN',                   dataType: 'ftFloat',    nullable: true,  persistent: true },
  primeachat:   { caption: 'Prime nette achetée',                   dataType: 'ftCurrency', nullable: true,  persistent: true },
  primeachat1:  { caption: 'Prime nette achetée (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
};

/** Fabrique un objet avec valeurs par défaut */
export const createPbg = (init?: Partial<Pbg>): Pbg => ({
  risque: 0,
  option: 0,
  ...init,
});
