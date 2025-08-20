// pb.model.ts

/** Scalar aliases (même base que les autres modèles) */
export type FtString<N extends number = number> = string;
export type FtInteger = number;
export type FtFloat = number;
export type FtCurrency = number;
export type FtBoolean = boolean;
export type FtDateTime = string; // ISO 8601
export type FtMemo = string;

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

/** Modèle issu de <pb><data>… */
export interface Pb {
  /** risque tarifé */
  risque: FtInteger; // not null, persistent

  /** tarif */
  tarif?: FtInteger; // nullable, persistent

  /** Date modif */
  modif?: FtDateTime; // nullable, persistent

  /** Date dernière revalo */
  revalo?: FtDateTime; // nullable, persistent

  /** prime nette annuelle */
  pnann?: FtCurrency; // nullable, persistent

  /** prime nette annuelle (ISO 4217 currency code) */
  pnann1?: FtString<3>; // nullable, persistent

  /** commission annuelle */
  coman?: FtCurrency; // nullable, persistent

  /** commission annuelle (ISO 4217 currency code) */
  coman1?: FtString<3>; // nullable, persistent

  /** Taxe annuelle */
  txann?: FtCurrency; // nullable, persistent

  /** Taxe annuelle (ISO 4217 currency code) */
  txann1?: FtString<3>; // nullable, persistent

  /** CatNat annuelle */
  cnann?: FtCurrency; // nullable, persistent

  /** CatNat annuelle (ISO 4217 currency code) */
  cnann1?: FtString<3>; // nullable, persistent

  /** prime totale annuelle */
  ptann?: FtCurrency; // nullable, persistent: false, calc: Permanent

  /** prime totale annuelle (ISO 4217 currency code) */
  ptann1?: FtString<3>; // nullable, persistent: false, calc: Permanent

  /** Avec taxe attentat */
  avecatt?: FtBoolean; // nullable, persistent
}

/** Métadonnées des champs (fieldTagMap) */
export const PbFieldTags: FieldTagMap<Pb> = {
  risque:   { caption: 'risque tarifé',                    dataType: 'ftInteger',  nullable: false, persistent: true  },
  tarif:    { caption: 'tarif',                            dataType: 'ftInteger',  nullable: true,  persistent: true  },
  modif:    { caption: 'Date modif',                       dataType: 'ftDateTime', nullable: true,  persistent: true  },
  revalo:   { caption: 'Date dernière revalo',             dataType: 'ftDateTime', nullable: true,  persistent: true  },
  pnann:    { caption: 'prime nette annuelle',             dataType: 'ftCurrency', nullable: true,  persistent: true  },
  pnann1:   { caption: 'prime nette annuelle (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
  coman:    { caption: 'commission annuelle',              dataType: 'ftCurrency', nullable: true,  persistent: true  },
  coman1:   { caption: 'commission annuelle (ISO 4217 currency code)',  dataType: 'ftString',  nullable: true, persistent: true },
  txann:    { caption: 'Taxe annuelle',                    dataType: 'ftCurrency', nullable: true,  persistent: true  },
  txann1:   { caption: 'Taxe annuelle (ISO 4217 currency code)',        dataType: 'ftString',  nullable: true, persistent: true },
  cnann:    { caption: 'CatNat annuelle',                  dataType: 'ftCurrency', nullable: true,  persistent: true  },
  cnann1:   { caption: 'CatNat annuelle (ISO 4217 currency code)',      dataType: 'ftString',  nullable: true, persistent: true },
  ptann:    { caption: 'prime totale annuelle',            dataType: 'ftCurrency', nullable: true,  persistent: false, calcType: 'Permanent' },
  ptann1:   { caption: 'prime totale annuelle (ISO 4217 currency code)',dataType: 'ftString',  nullable: true,  persistent: false, calcType: 'Permanent' },
  avecatt:  { caption: 'Avec taxe attentat',               dataType: 'ftBoolean',  nullable: true,  persistent: true  },
};

/** Fabrique un objet avec valeurs par défaut cohérentes */
export const createPb = (init?: Partial<Pb>): Pb => ({
  risque: 0,
  ...init,
});
