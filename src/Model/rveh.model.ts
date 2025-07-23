import { RisaModel } from "./risa.model";

/**
 * Interface représentant un risque véhicule.
 */

// MODELE RVEH GÉNÉRÉ

export interface RVEH {
  risque: number;
  numtiers?: number;
  immat?: string;
  datecg?: Date;
  datecirc?: Date;
  genre?: string;
  marque?: string;
  type?: string;
  modele?: string;
  symbmine?: string;
  nserie?: string;
  carross?: string;
  energie?: string;
  pfiscale?: number;
  puissan?: number;
  places?: number;
  poidvide?: string;
  poidstr?: string;
  valneuf?: number;
  valneuf1?: string;
  codegta?: string;
  groupe?: number;
  classe?: string;
  couleur?: string;
  alarme?: boolean;
  marquage?: boolean;
  antivol?: boolean;
  abs?: boolean;
  remorque?: boolean;
  numremor?: string;
  marquere?: string;
  anneerem?: Date;
  vanrem?: number;
  vanrem1?: string;
  ptcrem?: string;
  garage?: string;
  cpgar?: string;
  typegar?: string;
  zone?: string;
  szone?: string;
  nkm?: number;
  conttech?: Date;
  pct?: Date;
  orgleas?: string;
  dateprtr?: Date;
  datdertr?: Date;
  nbtraite?: number;
  usage?: string;
  crm?: number;
  datecrm?: Date;
  crmmaxi?: Date;
  crmdepui?: Date;
  joker?: boolean;
  s000_12?: number;
  s050_12?: number;
  s100_12?: number;
  sgel_12?: number;
  sini_12?: number;
  s000_24?: number;
  s050_24?: number;
  s100_24?: number;
  sgel_24?: number;
  sini_24?: number;
  s000_36?: number;
  s050_36?: number;
  s100_36?: number;
  sgel_36?: number;
  sini_36?: number;
  s000_48?: number;
  s050_48?: number;
  s100_48?: number;
  sgel_48?: number;
  sini_48?: number;
  majcrm?: string;
  ancimmat?: string;
  txbonus?: number;
  txmalus?: number;
  sbonus?: number;
  cylind?: string;
  cate?: string;
  clasrep?: string;
  valexp?: number;
  valexp1?: string;
  catego?: string;
  justanc?: string;
  titulq?: number;
  titulai?: string;
  co2?: number;
  catco2?: string;
  gage?: boolean;
  typeloc?: string;
  transmis?: string;
  version?: string;
  dateach?: Date;
  cnit?: string;
  paysimmat?: string;
  dancimm?: Date;
  derogationfva?: string;
}

// TAGMAP: Associe la clé à la valeur Caption du XML
export const rvehTagMap: Record<keyof RVEH, string> = {
  risque: "N° ordre",
  numtiers: "N° tiers",
  immat: "N° immatriculation",
  datecg: "date carte grise",
  datecirc: "date de Mise en circulation",
  genre: "genre",
  marque: "Marque",
  type: "Type",
  modele: "Modèle",
  symbmine: "Type mine",
  nserie: "N° dans la Série du Type",
  carross: "Carrosserie",
  energie: "Energie",
  pfiscale: "Cv fiscaux",
  puissan: "Puissance",
  places: "Places assises",
  poidvide: "Poids à vide",
  poidstr: "Poids total Roulant",
  valneuf: "Valeur à neuf",
  valneuf1: "Valeur à neuf (ISO 4217 currency code)",
  codegta: "code GTA",
  groupe: "groupe",
  classe: "classe",
  couleur: "couleur principale",
  alarme: "avec alarme",
  marquage: "avec marquage",
  antivol: "avec antivol",
  abs: "Avec ABS",
  remorque: "remorque +750kg (ou side)",
  numremor: "immatriculation remorque",
  marquere: "marque de remorque",
  anneerem: "année de la remorque",
  vanrem: "valeur de la remorque",
  vanrem1: "valeur de la remorque (ISO 4217 currency code)",
  ptcrem: "Poids TC remorque",
  garage: "lieu habituel de garage",
  cpgar: "Code postal garage",
  typegar: "type de garage",
  zone: "zone",
  szone: "sous-zone",
  nkm: "nombre de kilometres",
  conttech: "dernier controle technique",
  pct: "prochain controle technique",
  orgleas: "organisme de leasing",
  dateprtr: "date de la 1iere traite",
  datdertr: "date de la derniere traite",
  nbtraite: "nombre de traites",
  usage: "usage",
  crm: "Coeffic. Réduction/Majoration",
  datecrm: "CRM à la date du",
  crmmaxi: "date du CRM minimum",
  crmdepui: "CRM sans interruption depuis",
  joker: "Sinistre resp. non imputé CRM",
  s000_12: "sinistres 0% en 12 mois",
  s050_12: "sinistres 50% en 12 mois",
  s100_12: "sinistres 100% en 12 mois",
  sgel_12: 'Sinistres "gel" en 12 mois',
  sini_12: "total sinistres en 12 mois",
  s000_24: "sinistres 0% en 24 mois",
  s050_24: "sinistres 50% en 24 mois",
  s100_24: "sinistres 100% en 24 mois",
  sgel_24: 'Sinistres "gel" en 24 mois',
  sini_24: "total sinistres en 24 mois",
  s000_36: "sinistres 0% en 36 mois",
  s050_36: "sinistres 50% en 36 mois",
  s100_36: "sinistres 100% en 36 mois",
  sgel_36: 'Sinistres "gel" en 36 mois',
  sini_36: "total sinistres en 36 mois",
  s000_48: "sinistres 0% en 48 mois",
  s050_48: "sinistres 50% en 48 mois",
  s100_48: "sinistres 100% en 48 mois",
  sgel_48: 'Sinistres "gel" en 48 mois',
  sini_48: "total sinistres en 48 mois",
  majcrm: "Mode de mise à jour du CRM",
  ancimmat: "Ancienne immatriculation",
  txbonus: "Taux de bonus spécifique",
  txmalus: "Taux Malus spécifique",
  sbonus: "Super bonus",
  cylind: "cylindrée (cm3)",
  cate: "Catégorie véhicule",
  clasrep: "Classe réparation",
  valexp: "Valeur expertise",
  valexp1: "Valeur expertise (ISO 4217 currency code)",
  catego: "Catégorie véhicule",
  justanc: "Durée assurance préalable",
  titulq: "Dossier Titulaire CG",
  titulai: "Titulaire de la carte grise",
  co2: "Taux de CO2",
  catco2: "Catégorie CO2",
  gage: "Véhicule gagé",
  typeloc: "Type de location",
  transmis: "Mode de transmission",
  version: "Version",
  dateach: "Date d'acquisition",
  cnit: "Code National d’Identification au Type",
  paysimmat: "Pays d'immatriculation (FVA)",
  dancimm: "Date changement immatriculation",
  derogationfva: "Dérogation FVA",
};

export interface RvehModel {
    /** N° ordre */
    risque: number;
  
    /** N° tiers */
    numtiers?: number;
  
    /** N° immatriculation */
    immat?: string;
  
    /** Date carte grise */
    datecg?: Date;
  
    /** Date de mise en circulation */
    datecirc?: Date;
  
    /** Genre */
    genre?: string; // GENREVEH
  
    /** Marque */
    marque?: string; // MARQUES
  
    /** Type */
    type?: string;
  
    /** Modèle */
    modele?: string;
  
    /** Type mine */
    symbmine?: string;
  
    /** N° dans la Série du Type */
    nserie?: string;
  
    /** Carrosserie */
    carross?: string; // CARROSSERI
  
    /** Energie */
    energie?: string; // ENERGIE
  
    /** Cv fiscaux */
    pfiscale?: number;
  
    /** Puissance */
    puissan?: number;
  
    /** Places assises */
    places?: number;
  
    /** Poids à vide */
    poidvide?: string;
  
    /** Poids total Roulant */
    poidstr?: string;
  
    /** Valeur à neuf */
    valneuf?: number;
  
    /** Valeur à neuf (ISO code) */
    valneuf1?: string;
  
    /** Code GTA */
    codegta?: string;
  
    /** Groupe */
    groupe?: number;
  
    /** Classe */
    classe?: string;
  
    /** Couleur principale */
    couleur?: string;
  
    /** Avec alarme */
    alarme?: boolean;
  
    /** Avec marquage */
    marquage?: boolean;
  
    /** Avec antivol */
    antivol?: boolean;
  
    /** Avec ABS */
    abs?: boolean;
  
    /** Remorque +750kg (ou side) */
    remorque?: boolean;
  
    /** Immatriculation remorque */
    numremor?: string;
  
    /** Marque remorque */
    marquere?: string; // MARQUEREM
  
    /** Année remorque */
    anneerem?: Date;
  
    /** Valeur remorque */
    vanrem?: number;
  
    /** Valeur remorque (ISO code) */
    vanrem1?: string;
  
    /** Poids TC remorque */
    ptcrem?: string;
  
    /** Lieu habituel de garage */
    garage?: string;
  
    /** Code postal garage */
    cpgar?: string;
  
    /** Type de garage */
    typegar?: string; // TYPEGARA
  
    /** Zone */
    zone?: string;
  
    /** Sous-zone */
    szone?: string;
  
    /** Nombre de kilometres */
    nkm?: number;
  
    /** Dernier controle technique */
    conttech?: Date;
  
    /** Prochain controle technique */
    pct?: Date;
  
    /** Organisme de leasing */
    orgleas?: string;
  
    /** Date 1ère traite */
    dateprtr?: Date;
  
    /** Date dernière traite */
    datdertr?: Date;
  
    /** Nombre de traites */
    nbtraite?: number;
  
    /** Usage */
    usage?: string; // USAGE
  
    /** CRM (Coeff. Réduction/Majoration) */
    crm?: number;
  
    /** Date du CRM */
    datecrm?: Date;
  
    /** Date CRM minimum */
    crmmaxi?: Date;
  
    /** CRM sans interruption depuis */
    crmdepui?: Date;
  
    /** Sinistre resp. non imputé CRM */
    joker?: boolean;
  }
  export const RisaTagMap: Record<string, keyof RisaModel> = {
    risque: 'risque',
    numtiers: 'numtiers',
    appel: 'appel',
    ext: 'ext',
    images: 'images',
    memo: 'memo',
    identifi: 'identifi',
    zone: 'zone',
    tarif: 'tarif',
    origine: 'origine',
    dateori: 'dateori',
    centre: 'centre',
    datetar: 'datetar',
    datebia: 'datebia',
    ole: 'ole'
  };
  
  export const RvehFieldMap: Record<keyof RvehModel, string> = {
    risque: 'N° ordre',
    numtiers: 'N° tiers',
    immat: 'N° immatriculation',
    datecg: 'date carte grise',
    datecirc: 'date de Mise en circulation',
    genre: 'genre',
    marque: 'Marque',
    type: 'Type',
    modele: 'Modèle',
    symbmine: 'Type mine',
    nserie: 'N° dans la Série du Type',
    carross: 'Carrosserie',
    energie: 'Energie',
    pfiscale: 'Cv fiscaux',
    puissan: 'Puissance',
    places: 'Places assises',
    poidvide: 'Poids à vide',
    poidstr: 'Poids total Roulant',
    valneuf: 'Valeur à neuf',
    valneuf1: 'Valeur à neuf (ISO 4217 currency code)',
    codegta: 'code GTA',
    groupe: 'groupe',
    classe: 'classe',
    couleur: 'couleur principale',
    alarme: 'avec alarme',
    marquage: 'avec marquage',
    antivol: 'avec antivol',
    abs: 'Avec ABS',
    remorque: 'remorque +750kg (ou side)',
    numremor: 'immatriculation remorque',
    marquere: 'marque de remorque',
    anneerem: 'année de la remorque',
    vanrem: 'valeur de la remorque',
    vanrem1: 'valeur de la remorque (ISO 4217 currency code)',
    ptcrem: 'Poids TC remorque',
    garage: 'lieu habituel de garage',
    cpgar: 'Code postal garage',
    typegar: 'type de garage',
    zone: 'zone',
    szone: 'sous-zone',
    nkm: 'nombre de kilometres',
    conttech: 'dernier controle technique',
    pct: 'prochain controle technique',
    orgleas: 'organisme de leasing',
    dateprtr: 'date de la 1iere traite',
    datdertr: 'date de la derniere traite',
    nbtraite: 'nombre de traites',
    usage: 'usage',
    crm: 'Coeff. Réduction/Majoration',
    datecrm: 'CRM à la date du',
    crmmaxi: 'date du CRM minimum',
    crmdepui: 'CRM sans interruption depuis',
    joker: 'Sinistre resp. non imputé CRM',
  };
  
  export const RvehTagMap: Record<string, keyof RvehModel> = Object.entries(RvehFieldMap).reduce((acc, [key]) => {
    acc[key] = key as keyof RvehModel;
    return acc;
  }, {} as Record<string, keyof RvehModel>);
  
  