import { RisaModel } from "./risa.model";

/**
 * Interface représentant un risque véhicule.
 */
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
  
  