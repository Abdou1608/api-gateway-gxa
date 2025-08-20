// rveh.model.ts

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

/** Modèle issu de <rveh><data>… */
export interface Rveh {
  /** N° ordre */
  risque: FtInteger; // not null, persistent

  /** N° tiers */
  numtiers?: FtInteger;

  /** N° immatriculation */
  immat?: FtString;

  /** date carte grise */
  datecg?: FtDateTime;

  /** date de Mise en circulation */
  datecirc?: FtDateTime;

  /** genre (TABLE: GENREVEH) */
  genre?: FtString;

  /** Marque (TABLE: MARQUES) */
  marque?: FtString;

  /** Type */
  type?: FtString;

  /** Modèle */
  modele?: FtString;

  /** Type mine */
  symbmine?: FtString;

  /** N° dans la Série du Type */
  nserie?: FtString;

  /** Carrosserie (TABLE: CARROSSERI) */
  carross?: FtString;

  /** Energie (TABLE: ENERGIE) */
  energie?: FtString;

  /** Cv fiscaux */
  pfiscale?: FtSmallint;

  /** Puissance */
  puissan?: FtFloat;

  /** Places assises */
  places?: FtSmallint;

  /** Poids à vide */
  poidvide?: FtString;

  /** Poids total Roulant */
  poidstr?: FtString;

  /** Valeur à neuf */
  valneuf?: FtCurrency;

  /** Valeur à neuf (ISO 4217 currency code) */
  valneuf1?: FtString;

  /** code GTA */
  codegta?: FtString;

  /** groupe */
  groupe?: FtSmallint;

  /** classe */
  classe?: FtString;

  /** couleur principale */
  couleur?: FtString;

  /** avec alarme */
  alarme?: FtBoolean;

  /** avec marquage */
  marquage?: FtBoolean;

  /** avec antivol */
  antivol?: FtBoolean;

  /** Avec ABS */
  abs?: FtBoolean;

  /** remorque +750kg (ou side) */
  remorque?: FtBoolean;

  /** immatriculation remorque */
  numremor?: FtString;

  /** marque de remorque (TABLE: MARQUEREM) */
  marquere?: FtString;

  /** année de la remorque */
  annerem?: FtDateTime;

  /** valeur de la remorque */
  vanrem?: FtCurrency;

  /** valeur de la remorque (ISO 4217 currency code) */
  vanrem1?: FtString;

  /** Poids TC remorque */
  ptcrem?: FtString;

  /** lieu habituel de garage */
  garage?: FtString;

  /** Code postal garage */
  cpgar?: FtString;

  /** type de garage (TABLE: TYPEGARA) */
  typegar?: FtString;

  /** zone */
  zone?: FtString;

  /** sous-zone */
  szone?: FtString;

  /** nombre de kilometres */
  nkm?: FtInteger;

  /** dernier controle technique */
  conttech?: FtDateTime;

  /** prochain controle technique */
  pct?: FtDateTime;

  /** organisme de leasing */
  orgleas?: FtString;

  /** date de la 1iere traite */
  dateprtr?: FtDateTime;

  /** date de la derniere traite */
  datdertr?: FtDateTime;

  /** nombre de traites */
  nbtraite?: FtInteger;

  /** usage (TABLE: USAGE) */
  usage?: FtString;

  /** Coeffic. Réduction/Majoration */
  crm?: FtFloat;

  /** CRM à la date du */
  datecrm?: FtDateTime;

  /** date du CRM minimum */
  crmmaxi?: FtDateTime;

  /** CRM sans interruption depuis */
  crmdepui?: FtDateTime;

  /** Sinistre resp. non imputé CRM */
  joker?: FtBoolean;

  /** sinistres 0% en 12 mois */
  s000_12?: FtSmallint;

  /** sinistres 50% en 12 mois */
  s050_12?: FtSmallint;

  /** sinistres 100% en 12 mois */
  s100_12?: FtSmallint;

  /** Sinistres "gel" en 12 mois */
  sgel_12?: FtSmallint;

  /** total sinistres en 12 mois */
  sini_12?: FtSmallint;

  /** sinistres 0% en 24 mois */
  s000_24?: FtSmallint;

  /** sinistres 50% en 24 mois */
  s050_24?: FtSmallint;

  /** sinistres 100% en 24 mois */
  s100_24?: FtSmallint;

  /** Sinistres "gel" en 24 mois */
  sgel_24?: FtSmallint;

  /** total sinistres en 24 mois */
  sini_24?: FtSmallint;

  /** sinistres 0% en 36 mois */
  s000_36?: FtSmallint;

  /** sinistres 50% en 36 mois */
  s050_36?: FtSmallint;

  /** sinistres 100% en 36 mois */
  s100_36?: FtSmallint;

  /** Sinistres "gel" en 36 mois */
  sgel_36?: FtSmallint;

  /** total sinistres en 36 mois */
  sini_36?: FtSmallint;

  /** sinistres 0% en 48 mois */
  s000_48?: FtSmallint;

  /** sinistres 50% en 48 mois */
  s050_48?: FtSmallint;

  /** sinistres 100% en 48 mois */
  s100_48?: FtSmallint;

  /** Sinistres "gel" en 48 mois */
  sgel_48?: FtSmallint;

  /** total sinistres en 48 mois */
  sini_48?: FtSmallint;

  /** Mode de mise à jour du CRM (TABLE: MAJCRM) */
  majcrm?: FtString;

  /** Ancienne immatriculation */
  ancimmat?: FtString;

  /** Taux de bonus spécifique */
  txbonus?: FtFloat;

  /** Taux Malus spécifique */
  txmalus?: FtFloat;

  /** Super bonus */
  sbonus?: FtFloat;

  /** cylindrée (cm3) (TABLE: CYLINDREE) */
  cylind?: FtString;

  /** Catégorie véhicule (TABLE: CATEVEHI) */
  cate?: FtString;

  /** Classe réparation */
  clasrep?: FtString;

  /** Valeur expertise */
  valexp?: FtCurrency;

  /** Valeur expertise (ISO 4217 currency code) */
  valexp1?: FtString;

  /** Catégorie véhicule */
  catego?: FtString;

  /** Durée assurance préalable (TABLE: ANCASSPREA) */
  justanc?: FtString;

  /** Dossier Titulaire CG */
  titulq?: FtInteger;

  /** Titulaire de la carte grise (calc On save when empty) */
  titulai?: FtString;

  /** Taux de CO2 */
  co2?: FtFloat;

  /** Catégorie CO2 */
  catco2?: FtString;

  /** Véhicule gagé */
  gage?: FtBoolean;

  /** Type de location (TABLE: RVEHTYPELO) */
  typeloc?: FtString;

  /** Mode de transmission (TABLE: TRANSMIS) */
  transmis?: FtString;

  /** Version */
  version?: FtString;

  /** Date d'acquisition */
  dateach?: FtDateTime;

  /** Code National d’Identification au Type */
  cnit?: FtString;

  /** Pays d'immatriculation (FVA) (TABLE: ISO3166) */
  paysimmat?: FtString;

  /** Date changement immatriculation */
  dancimm?: FtDateTime;

  /** Dérogation FVA (TABLE: FVADEROG) */
  derogationfva?: FtString;
}

/** fieldTagMap (métadonnées pour chaque propriété) */
export const RvehFieldTags: FieldTagMap<Rveh> = {
  risque:   { caption: 'N° ordre', dataType: 'ftInteger', nullable: false, persistent: true },

  numtiers: { caption: 'N° tiers', dataType: 'ftInteger', nullable: true, persistent: true },
  immat:    { caption: 'N° immatriculation', dataType: 'ftString', nullable: true, persistent: true },
  datecg:   { caption: 'date carte grise', dataType: 'ftDateTime', nullable: true, persistent: true },
  datecirc: { caption: 'date de Mise en circulation', dataType: 'ftDateTime', nullable: true, persistent: true },

  genre:    { caption: 'genre', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'GENREVEH' },
  marque:   { caption: 'Marque', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'MARQUES' },
  type:     { caption: 'Type', dataType: 'ftString', nullable: true, persistent: true },
  modele:   { caption: 'Modèle', dataType: 'ftString', nullable: true, persistent: true },
  symbmine: { caption: 'Type mine', dataType: 'ftString', nullable: true, persistent: true },
  nserie:   { caption: 'N° dans la Série du Type', dataType: 'ftString', nullable: true, persistent: true },

  carross:  { caption: 'Carrosserie', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'CARROSSERI' },
  energie:  { caption: 'Energie', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'ENERGIE' },

  pfiscale: { caption: 'Cv fiscaux', dataType: 'ftSmallint', nullable: true, persistent: true },
  puissan:  { caption: 'Puissance', dataType: 'ftFloat', nullable: true, persistent: true },
  places:   { caption: 'Places assises', dataType: 'ftSmallint', nullable: true, persistent: true },

  poidvide: { caption: 'Poids à vide', dataType: 'ftString', nullable: true, persistent: true },
  poidstr:  { caption: 'Poids total Roulant', dataType: 'ftString', nullable: true, persistent: true },

  valneuf:  { caption: 'Valeur à neuf', dataType: 'ftCurrency', nullable: true, persistent: true },
  valneuf1: { caption: 'Valeur à neuf (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },

  codegta:  { caption: 'code GTA', dataType: 'ftString', nullable: true, persistent: true },
  groupe:   { caption: 'groupe', dataType: 'ftSmallint', nullable: true, persistent: true },
  classe:   { caption: 'classe', dataType: 'ftString', nullable: true, persistent: true },
  couleur:  { caption: 'couleur principale', dataType: 'ftString', nullable: true, persistent: true },

  alarme:   { caption: 'avec alarme', dataType: 'ftBoolean', nullable: true, persistent: true },
  marquage: { caption: 'avec marquage', dataType: 'ftBoolean', nullable: true, persistent: true },
  antivol:  { caption: 'avec antivol', dataType: 'ftBoolean', nullable: true, persistent: true },
  abs:      { caption: 'Avec ABS', dataType: 'ftBoolean', nullable: true, persistent: true },

  remorque: { caption: 'remorque +750kg (ou side)', dataType: 'ftBoolean', nullable: true, persistent: true },
  numremor: { caption: 'immatriculation remorque', dataType: 'ftString', nullable: true, persistent: true },
  marquere: { caption: 'marque de remorque', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'MARQUEREM' },
  annerem:  { caption: 'année de la remorque', dataType: 'ftDateTime', nullable: true, persistent: true },
  vanrem:   { caption: 'valeur de la remorque', dataType: 'ftCurrency', nullable: true, persistent: true },
  vanrem1:  { caption: 'valeur de la remorque (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
  ptcrem:   { caption: 'Poids TC remorque', dataType: 'ftString', nullable: true, persistent: true },

  garage:   { caption: 'lieu habituel de garage', dataType: 'ftString', nullable: true, persistent: true },
  cpgar:    { caption: 'Code postal garage', dataType: 'ftString', nullable: true, persistent: true },
  typegar:  { caption: 'type de garage', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'TYPEGARA' },
  zone:     { caption: 'zone', dataType: 'ftString', nullable: true, persistent: true },
  szone:    { caption: 'sous-zone', dataType: 'ftString', nullable: true, persistent: true },

  nkm:      { caption: 'nombre de kilometres', dataType: 'ftInteger', nullable: true, persistent: true },
  conttech: { caption: 'dernier controle technique', dataType: 'ftDateTime', nullable: true, persistent: true },
  pct:      { caption: 'prochain controle technique', dataType: 'ftDateTime', nullable: true, persistent: true },

  orgleas:  { caption: 'organisme de leasing', dataType: 'ftString', nullable: true, persistent: true },
  dateprtr: { caption: 'date de la 1iere traite', dataType: 'ftDateTime', nullable: true, persistent: true },
  datdertr: { caption: 'date de la derniere traite', dataType: 'ftDateTime', nullable: true, persistent: true },
  nbtraite: { caption: 'nombre de traites', dataType: 'ftInteger', nullable: true, persistent: true },

  usage:    { caption: 'usage', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'USAGE' },
  crm:      { caption: 'Coeffic. Réduction/Majoration', dataType: 'ftFloat', nullable: true, persistent: true },
  datecrm:  { caption: 'CRM à la date du', dataType: 'ftDateTime', nullable: true, persistent: true },
  crmmaxi:  { caption: 'date du CRM minimum', dataType: 'ftDateTime', nullable: true, persistent: true },
  crmdepui: { caption: 'CRM sans interruption depuis', dataType: 'ftDateTime', nullable: true, persistent: true },
  joker:    { caption: 'Sinistre resp. non imputé CRM', dataType: 'ftBoolean', nullable: true, persistent: true },

  s000_12:  { caption: 'sinistres 0% en 12 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  s050_12:  { caption: 'sinistres 50% en 12 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  s100_12:  { caption: 'sinistres 100% en 12 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  sgel_12:  { caption: 'Sinistres "gel" en 12 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  sini_12:  { caption: 'total sinistres en 12 mois', dataType: 'ftSmallint', nullable: true, persistent: true },

  s000_24:  { caption: 'sinistres 0% en 24 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  s050_24:  { caption: 'sinistres 50% en 24 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  s100_24:  { caption: 'sinistres 100% en 24 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  sgel_24:  { caption: 'Sinistres "gel" en 24 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  sini_24:  { caption: 'total sinistres en 24 mois', dataType: 'ftSmallint', nullable: true, persistent: true },

  s000_36:  { caption: 'sinistres 0% en 36 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  s050_36:  { caption: 'sinistres 50% en 36 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  s100_36:  { caption: 'sinistres 100% en 36 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  sgel_36:  { caption: 'Sinistres "gel" en 36 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  sini_36:  { caption: 'total sinistres en 36 mois', dataType: 'ftSmallint', nullable: true, persistent: true },

  s000_48:  { caption: 'sinistres 0% en 48 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  s050_48:  { caption: 'sinistres 50% en 48 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  s100_48:  { caption: 'sinistres 100% en 48 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  sgel_48:  { caption: 'Sinistres "gel" en 48 mois', dataType: 'ftSmallint', nullable: true, persistent: true },
  sini_48:  { caption: 'total sinistres en 48 mois', dataType: 'ftSmallint', nullable: true, persistent: true },

  majcrm:   { caption: 'Mode de mise à jour du CRM', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'MAJCRM' },
  ancimmat: { caption: 'Ancienne immatriculation', dataType: 'ftString', nullable: true, persistent: true },
  txbonus:  { caption: 'Taux de bonus spécifique', dataType: 'ftFloat', nullable: true, persistent: true },
  txmalus:  { caption: 'Taux Malus spécifique', dataType: 'ftFloat', nullable: true, persistent: true },
  sbonus:   { caption: 'Super bonus', dataType: 'ftFloat', nullable: true, persistent: true },

  cylind:   { caption: 'cylindrée (cm3)', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'CYLINDREE' },
  cate:     { caption: 'Catégorie véhicule', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'CATEVEHI' },
  clasrep:  { caption: 'Classe réparation', dataType: 'ftString', nullable: true, persistent: true },

  valexp:   { caption: 'Valeur expertise', dataType: 'ftCurrency', nullable: true, persistent: true },
  valexp1:  { caption: 'Valeur expertise (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },

  catego:   { caption: 'Catégorie véhicule', dataType: 'ftString', nullable: true, persistent: true },
  justanc:  { caption: 'Durée assurance préalable', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'ANCASSPREA' },

  titulq:   { caption: 'Dossier Titulaire CG', dataType: 'ftInteger', nullable: true, persistent: true },
  titulai:  { caption: 'Titulaire de la carte grise', dataType: 'ftString', nullable: true, persistent: true, calcType: 'On save when empty' },

  co2:      { caption: 'Taux de CO2', dataType: 'ftFloat', nullable: true, persistent: true },
  catco2:   { caption: 'Catégorie CO2', dataType: 'ftString', nullable: true, persistent: true },
  gage:     { caption: 'Véhicule gagé', dataType: 'ftBoolean', nullable: true, persistent: true },

  typeloc:  { caption: 'Type de location', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'RVEHTYPELO' },
  transmis: { caption: 'Mode de transmission', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'TRANSMIS' },

  version:  { caption: 'Version', dataType: 'ftString', nullable: true, persistent: true },
  dateach:  { caption: "Date d'acquisition", dataType: 'ftDateTime', nullable: true, persistent: true },
  cnit:     { caption: 'Code National d’Identification au Type', dataType: 'ftString', nullable: true, persistent: true },

  paysimmat:{ caption: "Pays d'immatriculation (FVA)", dataType: 'ftString', nullable: true, persistent: true, codeTable: 'ISO3166' },
  dancimm:  { caption: 'Date changement immatriculation', dataType: 'ftDateTime', nullable: true, persistent: true },
  derogationfva: { caption: 'Dérogation FVA', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'FVADEROG' },
};

/** Fabrique un objet avec valeurs par défaut */
export const createRveh = (init?: Partial<Rveh>): Rveh => ({
  risque: 0,
  ...init,
});
