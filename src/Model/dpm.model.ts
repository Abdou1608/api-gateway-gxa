// src/app/models/dpm.model.ts

/** Types de données (métadonnées) */
export type FtDataType =
  | 'ftInteger'
  | 'ftString'
  | 'ftBoolean'
  | 'ftDateTime'
  | 'ftFloat'
  | 'ftCurrency'
  | 'ftMemo';

/** Métadonnées par champ */
export interface FieldTags {
  caption?: string;
  dataType?: FtDataType;
  nullable?: boolean;
  persistent?: boolean;
  calcType?: string;
  codeTable?: string;
  length?: number;
}

/** Map de métadonnées pour un type T (clé = propriété) */
export type FieldTagMap<T> = {
  [K in keyof T]?: FieldTags;
};

/* -------------------------------------------------------------------------- */
/*  Modèle DpmModel (1ʳᵉ lettre de chaque champ en Majuscule)                 */
/* -------------------------------------------------------------------------- */

export interface DpmModel {
  /** Numéro de tiers (non null) */
  Numtiers: number;

  /** statut juridique */
  Statutju?: Statutju;

  /** capital */
  Capital?: number;

  /** capital (ISO 4217 currency code) */
  Capital1?: string;

  /** Numéro siret */
  Nsiret?: string;

  /** Numéro RC */
  Nrc?: string;

  /** Numéro RM */
  Nrm?: string;

  /** Code N A F */
  Codeape?: string;

  /** Lieu d'immatriculation */
  Lieuimm?: string;

  /** TVA intracommunautaire */
  Tvaintra?: string;

  /** Date de création */
  Datecre?: string;

  /** Nombre d'établissements */
  Nbetabli?: number;

  /** Nombre de salariés */
  Nbsalar?: number;

  /** Nombre de cadres */
  Nbcadre?: number;

  /** Nombre de non cadres */
  Noncadre?: number;

  /** filiale de */
  Groupe?: number;

  /** participation de la mère */
  Partic?: number;

  /** année 1 */
  Annee1?: string;

  /** année 2 */
  Annee2?: string;

  /** année 3 */
  Annee3?: string;

  /** masse salariale 1 */
  Salair1?: number;

  /** masse salariale 1 (ISO 4217 currency code) */
  Salair11?: string;

  /** masse salariale 2 */
  Salair2?: number;

  /** masse salariale 2 (ISO 4217 currency code) */
  Salair21?: string;

  /** masse salariale 3 */
  Salair3?: number;

  /** masse salariale 3 (ISO 4217 currency code) */
  Salair31?: string;

  /** C.A. H.T année 1 */
  Caht1?: number;

  /** C.A. H.T année 1 (ISO 4217 currency code) */
  Caht11?: string;

  /** C.A. H.T. année 2 */
  Caht2?: number;

  /** C.A. H.T. année 2 (ISO 4217 currency code) */
  Caht21?: string;

  /** C.A. H.T. année 3 */
  Caht3?: number;

  /** C.A. H.T. année 3 (ISO 4217 currency code) */
  Caht31?: string;

  /** marge brute 1 */
  Marge1?: number;

  /** marge brute 1 (ISO 4217 currency code) */
  Marge11?: string;

  /** marge brute 2 */
  Marge2?: number;

  /** marge brute 2 (ISO 4217 currency code) */
  Marge21?: string;

  /** marge brute 3 */
  Marge3?: number;

  /** marge brute 3 (ISO 4217 currency code) */
  Marge31?: string;

  /** entité juridique (si banque) */
  Entite?: string;

  /** n. d'émetteur (si banque) */
  Emetteur?: string;

  /** num. comptable banque */
  Compteba?: string;

  /** Interlocuteur privilégié */
  Interl?: number;

  /** Activité commerciale */
  Activite?: string;

  /** Convention collective */
  Convcol?: ConvColl;

  /** site internet */
  Url?: string;

  /** Expert comptable */
  Expert?: number;

  /** Début exercice comptable JJ/MM */
  Debexe?: string;

  /** Fin exercice comptable JJ/MM */
  Finexe?: string;

  /** Numéro de convention collective */
  Numeroconvcol?: string;

  /** Numéro de Brochure */
  Numerobrochure?: ConvColl;

  /** N. immatriculation ORIAS */
  Oriasregistrationid?: string;

  /** Date derniere consultation du RBE */
  Rbelastupdate?: string;
}

/* -------------------------------------------------------------------------- */
/*  FieldTagMap dérivé des commentaires                                       */
/* -------------------------------------------------------------------------- */
export const DpmFieldTagMap: FieldTagMap<DpmModel> = {
  Numtiers: { caption: 'Numéro de tiers', dataType: 'ftInteger', nullable: false, persistent: true },

  Statutju: { caption: 'statut juridique', dataType: 'ftString', nullable: true, persistent: true },
  Capital:  { caption: 'capital', dataType: 'ftCurrency', nullable: true, persistent: true },
  Capital1: { caption: 'capital (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },

  Nsiret:   { caption: 'Numéro siret', dataType: 'ftString', nullable: true, persistent: true },
  Nrc:      { caption: 'Numéro RC', dataType: 'ftString', nullable: true, persistent: true },
  Nrm:      { caption: 'Numéro RM', dataType: 'ftString', nullable: true, persistent: true },
  Codeape:  { caption: 'Code N A F', dataType: 'ftString', nullable: true, persistent: true },
  Lieuimm:  { caption: "Lieu d'immatriculation", dataType: 'ftString', nullable: true, persistent: true },
  Tvaintra: { caption: 'TVA intracommunautaire', dataType: 'ftString', nullable: true, persistent: true },

  Datecre:  { caption: 'Date de création', dataType: 'ftDateTime', nullable: true, persistent: true },

  Nbetabli: { caption: "Nombre d'établissements", dataType: 'ftInteger', nullable: true, persistent: true },
  Nbsalar:  { caption: 'Nombre de salariés', dataType: 'ftInteger', nullable: true, persistent: true },
  Nbcadre:  { caption: 'Nombre de cadres', dataType: 'ftInteger', nullable: true, persistent: true },
  Noncadre: { caption: 'Nombre de non cadres', dataType: 'ftInteger', nullable: true, persistent: true },

  Groupe:   { caption: 'filiale de', dataType: 'ftInteger', nullable: true, persistent: true },
  Partic:   { caption: 'participation de la mère', dataType: 'ftFloat', nullable: true, persistent: true },

  Annee1:   { caption: 'année 1', dataType: 'ftString', nullable: true, persistent: true },
  Annee2:   { caption: 'année 2', dataType: 'ftString', nullable: true, persistent: true },
  Annee3:   { caption: 'année 3', dataType: 'ftString', nullable: true, persistent: true },

  Salair1:  { caption: 'masse salariale 1', dataType: 'ftCurrency', nullable: true, persistent: true },
  Salair11: { caption: 'masse salariale 1 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
  Salair2:  { caption: 'masse salariale 2', dataType: 'ftCurrency', nullable: true, persistent: true },
  Salair21: { caption: 'masse salariale 2 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
  Salair3:  { caption: 'masse salariale 3', dataType: 'ftCurrency', nullable: true, persistent: true },
  Salair31: { caption: 'masse salariale 3 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },

  Caht1:    { caption: 'C.A. H.T année 1', dataType: 'ftCurrency', nullable: true, persistent: true },
  Caht11:   { caption: 'C.A. H.T année 1 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
  Caht2:    { caption: 'C.A. H.T. année 2', dataType: 'ftCurrency', nullable: true, persistent: true },
  Caht21:   { caption: 'C.A. H.T. année 2 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
  Caht3:    { caption: 'C.A. H.T. année 3', dataType: 'ftCurrency', nullable: true, persistent: true },
  Caht31:   { caption: 'C.A. H.T. année 3 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },

  Marge1:   { caption: 'marge brute 1', dataType: 'ftCurrency', nullable: true, persistent: true },
  Marge11:  { caption: 'marge brute 1 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
  Marge2:   { caption: 'marge brute 2', dataType: 'ftCurrency', nullable: true, persistent: true },
  Marge21:  { caption: 'marge brute 2 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
  Marge3:   { caption: 'marge brute 3', dataType: 'ftCurrency', nullable: true, persistent: true },
  Marge31:  { caption: 'marge brute 3 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },

  Entite:   { caption: 'entité juridique (si banque)', dataType: 'ftString', nullable: true, persistent: true },
  Emetteur: { caption: "n. d'émetteur (si banque)", dataType: 'ftString', nullable: true, persistent: true },
  Compteba: { caption: 'num. comptable banque', dataType: 'ftString', nullable: true, persistent: true },

  Interl:   { caption: 'Interlocuteur privilégié', dataType: 'ftInteger', nullable: true, persistent: true },
  Activite: { caption: 'Activité commerciale', dataType: 'ftString', nullable: true, persistent: true },
  Convcol:  { caption: 'Convention collective', dataType: 'ftString', nullable: true, persistent: true },

  Url:      { caption: 'site internet', dataType: 'ftString', nullable: true, persistent: true },
  Expert:   { caption: 'Expert comptable', dataType: 'ftInteger', nullable: true, persistent: true },

  Debexe:   { caption: 'Début exercice comptable JJ/MM', dataType: 'ftString', nullable: true, persistent: true },
  Finexe:   { caption: 'Fin exercice comptable JJ/MM', dataType: 'ftString', nullable: true, persistent: true },

  Numeroconvcol:  { caption: 'Numéro de convention collective', dataType: 'ftString', nullable: true, persistent: true },
  Numerobrochure: { caption: 'Numéro de Brochure', dataType: 'ftString', nullable: true, persistent: true },

  Oriasregistrationid: { caption: 'N. immatriculation ORIAS', dataType: 'ftString', nullable: true, persistent: true },
  Rbelastupdate:       { caption: 'Date derniere consultation du RBE', dataType: 'ftDateTime', nullable: true, persistent: true },
};


  export enum Statutju {
  SARL = 'SARL',
  SAS = 'SAS',
  SA = 'SA',
  EI = 'EI',
}

export enum ConvColl {
  CCN_BTP = 'BTP',
  CCN_SANTE = 'Santé',
  CCN_COMMERCE = 'Commerce',
}
