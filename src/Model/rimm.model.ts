// rimm.model.ts

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
  calcType?: 'Fixed' | 'Permanent' | 'On every input' | 'On input when empty';
}

export type FieldTagMap<T> = { [K in keyof T]-?: TagMeta };

/** Modèle issu de <rimm><data>… */
export interface Rimm {
  /** numero du risque */
  risque: FtInteger; // not null, persistent

  /** type d'habitation (TABLE: TYPEHAB) */
  typehab?: FtString;

  /** statut du souscripteur (TABLE: STATOCCU) */
  statocc?: FtString;

  /** usage de l'habitation (TABLE: USAGEHAB) */
  usagehab?: FtString;

  /** nombre de pièces */
  nbpieces?: FtSmallint;

  /** superficie */
  superf?: FtFloat;

  /** avec inhabitation */
  inhabit?: FtBoolean;

  /** capital mobilier */
  capmob?: FtCurrency;

  /** capital mobilier (ISO 4217 currency code) */
  capmob1?: FtString;

  /** avec alarme */
  alarme?: FtBoolean;

  /** avec volets pleins */
  volets?: FtBoolean;

  /** avec porte blindée */
  portebli?: FtBoolean;

  /** Insert de cheminée */
  insert?: FtBoolean;

  /** le risque est isolé */
  risqisol?: FtBoolean;

  /** avec renonc/recours */
  renonrec?: FtBoolean;

  /** renonciation contre */
  contre?: FtString;

  /** adresse du risque (calc Permanent) */
  adresse?: FtString;

  /** N. et voie */
  adr1?: FtString;

  /** auxiliaire de voie */
  adr2?: FtString;

  /** Lieu dit */
  adr3?: FtString;

  /** Code postal */
  codp?: FtString;

  /** Bureau distributeur */
  ville?: FtString;

  /** Pays */
  pays?: FtString;

  /** Zone */
  zone?: FtString;

  /** Véranda */
  veranda?: FtBoolean;

  /** Surface véranda */
  surfver?: FtSmallint;

  /** Ctre commercial */
  cencom?: FtBoolean;

  /** Objet social (TABLE: STATUTJU) */
  objets?: FtString;

  /** Franchisé */
  franch?: FtBoolean;

  /** Vitrine */
  vitrine?: FtBoolean;

  /** Protection vitrine (TABLE: VITRI_PROT) */
  protvit?: FtString;

  /** Enseigne */
  enseig?: FtBoolean;

  /** Valeur Assurée */
  ensval?: FtCurrency;

  /** Valeur Assurée (ISO 4217 currency code) */
  ensval1?: FtString;

  /** Date de réception */
  daterec?: FtDateTime;

  /** Fin de garantie décennale (calc On every input) */
  dfindec?: FtDateTime;

  /** Nature de la RC (TABLE: RCPROF) */
  typerc?: FtString;

  /** Année */
  rcannee?: FtFloat;

  /** Assiette de prime retenue (TABLE: RCASSIETTE) */
  assiette?: FtString;

  /** Taux Retenu */
  rctaux?: FtString;

  /** Révision (calc On input when empty) */
  rcrevis?: FtString;

  /** Prime Minimum */
  rcprime?: FtCurrency;

  /** Prime Minimum (ISO 4217 currency code) */
  rcprime1?: FtString;

  /** Masse Salariale */
  rcmasse?: FtCurrency;

  /** Masse Salariale (ISO 4217 currency code) */
  rcmasse1?: FtString;

  /** Activité 1 (TABLE: RCACTIVITE) */
  activ1?: FtString;

  /** Activité 2 (TABLE: RCACTIVITE) */
  activ2?: FtString;

  /** Taux 2 */
  rctaux2?: FtString;

  /** ca2 */
  ca2?: FtCurrency;

  /** ca2 (ISO 4217 currency code) */
  ca21?: FtString;

  /** masse 2 */
  ms2?: FtCurrency;

  /** masse 2 (ISO 4217 currency code) */
  ms21?: FtString;

  /** Prime 2 */
  prime2?: FtCurrency;

  /** Prime 2 (ISO 4217 currency code) */
  prime21?: FtString;

  /** Effec2 */
  effec2?: FtFloat;

  /** Inhabitation (TABLE: MRH_INHABI) */
  inhab?: FtString;

  /** Niveau de Protection (TABLE: MRH_PROTEC) */
  nivprot?: FtString;

  /** Nbre d'enfants */
  enfant?: FtFloat;

  /** Objets de valeur */
  objval?: FtString;

  /** Bijoux */
  bijoux?: FtString;

  /** Nbre de dépendance */
  depend?: FtFloat;

  /** Superficie des Dépendances */
  super?: FtFloat;

  /** Piscine */
  piscine?: FtBoolean;

  /** Surface au sol */
  sol?: FtFloat;

  /** Surface des bureaux */
  surfbur?: FtFloat;

  /** Surface des commerces */
  surfcom?: FtFloat;

  /** Nombre de bâtiments */
  batiment?: FtInteger;

  /** Sous-sol */
  sousol?: FtInteger;

  /** Rez-de-chaussée */
  rdc?: FtInteger;

  /** Etages */
  etages?: FtInteger;

  /** Niveau du lot (TABLE: NIVOLOT) */
  nivlot?: FtString;

  /** Année de construction */
  annecons?: FtInteger;

  /** Logement < 10 ans */
  ancienlo?: FtBoolean;

  /** Monument historique */
  historiq?: FtBoolean;

  /** Monument classé */
  classe?: FtBoolean;

  /** Pourcentage habitation */
  usahabit?: FtFloat;

  /** Nombre de lots */
  lot?: FtFloat;

  /** N° de lot */
  numlot?: FtFloat;

  /** Nbre de lot autre que habitati */
  nbrelot?: FtInteger;

  /** Nature des lots autres */
  natlot?: FtMemo;

  /** Extincteurs mobiles */
  extmob?: FtBoolean;

  /** Détecteur de fumées */
  fumee?: FtBoolean;

  /** Alarme incendie */
  alarminc?: FtBoolean;

  /** Surface sprinklée */
  surfspri?: FtFloat;

  /** Nbre d'ascenseurs */
  ascen?: FtFloat;

  /** Garage en S/sol */
  garage?: FtBoolean;

  /** Surface Garage */
  garsup?: FtFloat;

  /** info personnalisée */
  c_perso?: FtString;

  /** Adresse au format INSEE */
  adrinsee?: FtBoolean;

  /** Adresse 1 (calc Fixed) */
  adresse1?: FtString;

  /** Adresse 2 (calc Fixed) */
  adresse2?: FtString;

  /** Adresse 3 (calc Fixed) */
  adresse3?: FtString;

  /** Latitude */
  latitude?: FtFloat;

  /** Longitude */
  longitude?: FtFloat;

  /** Etage */
  etage?: FtInteger;

  /** Panneau photovoltaïque */
  photovoltaique?: FtBoolean;

  /** Dépendance en communication */
  depcomm?: FtBoolean;

  /** Type de cheminée (TABLE: CHEMINEE) */
  typecheminee?: FtString;

  /** Niveau d'étage (TABLE: ETAGES) */
  niveau?: FtString;
}

/** fieldTagMap (métadonnées pour chaque propriété) */
export const RimmFieldTags: FieldTagMap<Rimm> = {
  risque: { caption: 'numero du risque', dataType: 'ftInteger', nullable: false, persistent: true },

  typehab: { caption: "type d'habitation", dataType: 'ftString', nullable: true, persistent: true, codeTable: 'TYPEHAB' },
  statocc: { caption: 'statut du souscripteur', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'STATOCCU' },
  usagehab:{ caption: "usage de l'habitation", dataType: 'ftString', nullable: true, persistent: true, codeTable: 'USAGEHAB' },
  nbpieces:{ caption: 'nombre de pièces', dataType: 'ftSmallint', nullable: true, persistent: true },
  superf:  { caption: 'superficie', dataType: 'ftFloat', nullable: true, persistent: true },
  inhabit: { caption: 'avec inhabitation', dataType: 'ftBoolean', nullable: true, persistent: true },
  capmob:  { caption: 'capital mobilier', dataType: 'ftCurrency', nullable: true, persistent: true },
  capmob1: { caption: 'capital mobilier (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
  alarme:  { caption: 'avec alarme', dataType: 'ftBoolean', nullable: true, persistent: true },
  volets:  { caption: 'avec volets pleins', dataType: 'ftBoolean', nullable: true, persistent: true },
  portebli:{ caption: 'avec porte blindée', dataType: 'ftBoolean', nullable: true, persistent: true },
  insert:  { caption: 'Insert de cheminée', dataType: 'ftBoolean', nullable: true, persistent: true },
  risqisol:{ caption: 'le risque est isolé', dataType: 'ftBoolean', nullable: true, persistent: true },
  renonrec:{ caption: 'avec renonc/recours', dataType: 'ftBoolean', nullable: true, persistent: true },
  contre:  { caption: 'renonciation contre', dataType: 'ftString', nullable: true, persistent: true },

  adresse: { caption: 'adresse du risque', dataType: 'ftString', nullable: true, persistent: false, calcType: 'Permanent' },
  adr1:    { caption: 'N. et voie', dataType: 'ftString', nullable: true, persistent: true },
  adr2:    { caption: 'auxiliaire de voie', dataType: 'ftString', nullable: true, persistent: true },
  adr3:    { caption: 'Lieu dit', dataType: 'ftString', nullable: true, persistent: true },
  codp:    { caption: 'Code postal', dataType: 'ftString', nullable: true, persistent: true },
  ville:   { caption: 'Bureau distributeur', dataType: 'ftString', nullable: true, persistent: true },
  pays:    { caption: 'Pays', dataType: 'ftString', nullable: true, persistent: true },
  zone:    { caption: 'Zone', dataType: 'ftString', nullable: true, persistent: true },

  veranda: { caption: 'Véranda', dataType: 'ftBoolean', nullable: true, persistent: true },
  surfver: { caption: 'Surface véranda', dataType: 'ftSmallint', nullable: true, persistent: true },
  cencom:  { caption: 'Ctre commercial', dataType: 'ftBoolean', nullable: true, persistent: true },
  objets:  { caption: 'Objet social', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'STATUTJU' },
  franch:  { caption: 'Franchisé', dataType: 'ftBoolean', nullable: true, persistent: true },
  vitrine: { caption: 'Vitrine', dataType: 'ftBoolean', nullable: true, persistent: true },
  protvit: { caption: 'Protection vitrine', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'VITRI_PROT' },
  enseig:  { caption: 'Enseigne', dataType: 'ftBoolean', nullable: true, persistent: true },
  ensval:  { caption: 'Valeur Assurée', dataType: 'ftCurrency', nullable: true, persistent: true },
  ensval1: { caption: 'Valeur Assurée (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },

  daterec: { caption: 'Date de réception', dataType: 'ftDateTime', nullable: true, persistent: true },
  dfindec: { caption: 'Fin de garantie décennale', dataType: 'ftDateTime', nullable: true, persistent: true, calcType: 'On every input' },

  typerc:  { caption: 'Nature de la RC', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'RCPROF' },
  rcannee: { caption: 'Année', dataType: 'ftFloat', nullable: true, persistent: true },
  assiette:{ caption: 'Assiette de prime retenue', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'RCASSIETTE' },
  rctaux:  { caption: 'Taux Retenu', dataType: 'ftString', nullable: true, persistent: true },
  rcrevis: { caption: 'Révision', dataType: 'ftString', nullable: true, persistent: true, calcType: 'On input when empty' },

  rcprime: { caption: 'Prime Minimum', dataType: 'ftCurrency', nullable: true, persistent: true },
  rcprime1:{ caption: 'Prime Minimum (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
  rcmasse: { caption: 'Masse Salariale', dataType: 'ftCurrency', nullable: true, persistent: true },
  rcmasse1:{ caption: 'Masse Salariale (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },

  activ1:  { caption: 'Activité 1', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'RCACTIVITE' },
  activ2:  { caption: 'Activité 2', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'RCACTIVITE' },
  rctaux2: { caption: 'Taux 2', dataType: 'ftString', nullable: true, persistent: true },
  ca2:     { caption: 'ca2', dataType: 'ftCurrency', nullable: true, persistent: true },
  ca21:    { caption: 'ca2 (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
  ms2:     { caption: 'masse 2', dataType: 'ftCurrency', nullable: true, persistent: true },
  ms21:    { caption: 'masse 2 (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
  prime2:  { caption: 'Prime 2', dataType: 'ftCurrency', nullable: true, persistent: true },
  prime21: { caption: 'Prime 2 (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
  effec2:  { caption: 'Effec2', dataType: 'ftFloat', nullable: true, persistent: true },

  inhab:   { caption: 'Inhabitation', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'MRH_INHABI' },
  nivprot: { caption: 'Niveau de Protection', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'MRH_PROTEC' },
  enfant:  { caption: "Nbre d'enfants", dataType: 'ftFloat', nullable: true, persistent: true },
  objval:  { caption: 'Objets de valeur', dataType: 'ftString', nullable: true, persistent: true },
  bijoux:  { caption: 'Bijoux', dataType: 'ftString', nullable: true, persistent: true },
  depend:  { caption: 'Nbre de dépendance', dataType: 'ftFloat', nullable: true, persistent: true },
  super:   { caption: 'Superficie des Dépendances', dataType: 'ftFloat', nullable: true, persistent: true },
  piscine: { caption: 'Piscine', dataType: 'ftBoolean', nullable: true, persistent: true },
  sol:     { caption: 'Surface au sol', dataType: 'ftFloat', nullable: true, persistent: true },
  surfbur: { caption: 'Surface des bureaux', dataType: 'ftFloat', nullable: true, persistent: true },
  surfcom: { caption: 'Surface des commerces', dataType: 'ftFloat', nullable: true, persistent: true },

  batiment:{ caption: 'Nombre de bâtiments', dataType: 'ftInteger', nullable: true, persistent: true },
  sousol:  { caption: 'Sous-sol', dataType: 'ftInteger', nullable: true, persistent: true },
  rdc:     { caption: 'Rez-de-chaussée', dataType: 'ftInteger', nullable: true, persistent: true },
  etages:  { caption: 'Etages', dataType: 'ftInteger', nullable: true, persistent: true },
  nivlot:  { caption: 'Niveau du lot', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'NIVOLOT' },
  annecons:{ caption: 'Année de construction', dataType: 'ftInteger', nullable: true, persistent: true },
  ancienlo:{ caption: 'Logement < 10 ans', dataType: 'ftBoolean', nullable: true, persistent: true },
  historiq:{ caption: 'Monument historique', dataType: 'ftBoolean', nullable: true, persistent: true },
  classe:  { caption: 'Monument classé', dataType: 'ftBoolean', nullable: true, persistent: true },
  usahabit:{ caption: 'Pourcentage habitation', dataType: 'ftFloat', nullable: true, persistent: true },
  lot:     { caption: 'Nombre de lots', dataType: 'ftFloat', nullable: true, persistent: true },
  numlot:  { caption: 'N° de lot', dataType: 'ftFloat', nullable: true, persistent: true },
  nbrelot: { caption: 'Nbre de lot autre que habitati', dataType: 'ftInteger', nullable: true, persistent: true },
  natlot:  { caption: 'Nature des lots autres', dataType: 'ftMemo', nullable: true, persistent: true },

  extmob:  { caption: 'Extincteurs mobiles', dataType: 'ftBoolean', nullable: true, persistent: true },
  fumee:   { caption: 'Détecteur de fumées', dataType: 'ftBoolean', nullable: true, persistent: true },
  alarminc:{ caption: 'Alarme incendie', dataType: 'ftBoolean', nullable: true, persistent: true },
  surfspri:{ caption: 'Surface sprinklée', dataType: 'ftFloat', nullable: true, persistent: true },
  ascen:   { caption: "Nbre d'ascenseurs", dataType: 'ftFloat', nullable: true, persistent: true },
  garage:  { caption: 'Garage en S/sol', dataType: 'ftBoolean', nullable: true, persistent: true },
  garsup:  { caption: 'Surface Garage', dataType: 'ftFloat', nullable: true, persistent: true },

  c_perso: { caption: 'info personnalisée', dataType: 'ftString', nullable: true, persistent: true },
  adrinsee:{ caption: 'Adresse au format INSEE', dataType: 'ftBoolean', nullable: true, persistent: true },

  adresse1:{ caption: 'Adresse 1', dataType: 'ftString', nullable: true, persistent: false, calcType: 'Fixed' },
  adresse2:{ caption: 'Adresse 2', dataType: 'ftString', nullable: true, persistent: false, calcType: 'Fixed' },
  adresse3:{ caption: 'Adresse 3', dataType: 'ftString', nullable: true, persistent: false, calcType: 'Fixed' },

  latitude: { caption: 'Latitude', dataType: 'ftFloat', nullable: true, persistent: true },
  longitude:{ caption: 'Longitude', dataType: 'ftFloat', nullable: true, persistent: true },
  etage:    { caption: 'Etage', dataType: 'ftInteger', nullable: true, persistent: true },
  photovoltaique:{ caption: 'Panneau photovoltaïque', dataType: 'ftBoolean', nullable: true, persistent: true },
  depcomm:  { caption: 'Dépendance en communication', dataType: 'ftBoolean', nullable: true, persistent: true },
  typecheminee:{ caption: 'Type de cheminée', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'CHEMINEE' },
  niveau:   { caption: "Niveau d'étage", dataType: 'ftString', nullable: true, persistent: true, codeTable: 'ETAGES' },
};

/** Fabrique un objet avec valeurs par défaut */
export const createRimm = (init?: Partial<Rimm>): Rimm => ({
  risque: 0,
  ...init,
});
