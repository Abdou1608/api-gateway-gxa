// project.model.ts

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

/** Modèle issu de <tarc0><data>… */
export interface Tarc0 {
  /** Numéro du projet */
  numproj: FtInteger; // not null, persistent

  /** Etat */
  rub?: FtString;

  /** Titre du projet */
  libelle?: FtString;

  /** Numéro de tiers */
  numtiers?: FtInteger;

  /** Créateur du projet */
  creepar?: FtString;

  /** Date de création */
  datecre?: FtDateTime;

  /** Modifié par */
  modifpar?: FtString;

  /** Date dernière ouverture */
  datdermo?: FtDateTime;

  /** Contrat souscrit */
  contrat?: FtInteger;

  /** Etat */
  statut?: FtString;

  /** titre (code table TITRE) */
  titre?: FtString;

  /** Nom-prénom */
  rsociale?: FtString;

  /** référence de classement */
  referenc?: FtString;

  /** Numéro et voie */
  adr1?: FtString;

  /** auxiliaire de voie */
  adr2?: FtString;

  /** Lieu dit */
  adr3?: FtString;

  /** code postal */
  codp?: FtString;

  /** bureau distributeur */
  ville?: FtString;

  /** téléphone domicile */
  ntel?: FtString;

  /** E mail internet domicile */
  numemail?: FtString;

  /** Nb. propositions choisies */
  selnb?: FtSmallint;

  /** N. proposition 1 */
  sel1?: FtInteger;

  /** N. proposition 2 */
  sel2?: FtInteger;

  /** N. proposition 3 */
  sel3?: FtInteger;

  /** N. proposition 4 */
  sel4?: FtInteger;

  /** N. proposition 5 */
  sel5?: FtInteger;

  /** Contrat origine */
  contori?: FtInteger;

  /** Piece origine */
  pieceori?: FtInteger;
}

/** fieldTagMap (métadonnées pour chaque propriété) */
export const Tarc0FieldTags: FieldTagMap<Tarc0> = {
  numproj:  { caption: 'Numéro du projet', dataType: 'ftInteger', nullable: false, persistent: true },
  rub:      { caption: 'Etat', dataType: 'ftString', nullable: true, persistent: true },
  libelle:  { caption: 'Titre du projet', dataType: 'ftString', nullable: true, persistent: true },
  numtiers: { caption: 'Numéro de tiers', dataType: 'ftInteger', nullable: true, persistent: true },
  creepar:  { caption: 'Créateur du projet', dataType: 'ftString', nullable: true, persistent: true },
  datecre:  { caption: 'Date de création', dataType: 'ftDateTime', nullable: true, persistent: true },
  modifpar: { caption: 'Modifié par', dataType: 'ftString', nullable: true, persistent: true },
  datdermo: { caption: 'Date dernière ouverture', dataType: 'ftDateTime', nullable: true, persistent: true },
  contrat:  { caption: 'Contrat souscrit', dataType: 'ftInteger', nullable: true, persistent: true },
  statut:   { caption: 'Etat', dataType: 'ftString', nullable: true, persistent: true },
  titre:    { caption: 'titre', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'TITRE' },
  rsociale: { caption: 'Nom-prénom', dataType: 'ftString', nullable: true, persistent: true },
  referenc: { caption: 'référence de classement', dataType: 'ftString', nullable: true, persistent: true },
  adr1:     { caption: 'Numéro et voie', dataType: 'ftString', nullable: true, persistent: true },
  adr2:     { caption: 'auxiliaire de voie', dataType: 'ftString', nullable: true, persistent: true },
  adr3:     { caption: 'Lieu dit', dataType: 'ftString', nullable: true, persistent: true },
  codp:     { caption: 'code postal', dataType: 'ftString', nullable: true, persistent: true },
  ville:    { caption: 'bureau distributeur', dataType: 'ftString', nullable: true, persistent: true },
  ntel:     { caption: 'téléphone domicile', dataType: 'ftString', nullable: true, persistent: true },
  numemail: { caption: 'E mail internet domicile', dataType: 'ftString', nullable: true, persistent: true },
  selnb:    { caption: 'Nb. propositions choisies', dataType: 'ftSmallint', nullable: true, persistent: true },
  sel1:     { caption: 'N. proposition 1', dataType: 'ftInteger', nullable: true, persistent: true },
  sel2:     { caption: 'N. proposition 2', dataType: 'ftInteger', nullable: true, persistent: true },
  sel3:     { caption: 'N. proposition 3', dataType: 'ftInteger', nullable: true, persistent: true },
  sel4:     { caption: 'N. proposition 4', dataType: 'ftInteger', nullable: true, persistent: true },
  sel5:     { caption: 'N. proposition 5', dataType: 'ftInteger', nullable: true, persistent: true },
  contori:  { caption: 'Contrat origine', dataType: 'ftInteger', nullable: true, persistent: true },
  pieceori: { caption: 'Piece origine', dataType: 'ftInteger', nullable: true, persistent: true },
};

/** Fabrique un objet avec valeurs par défaut */
export const createTarc0 = (init?: Partial<Tarc0>): Tarc0 => ({
  numproj: 0,
  ...init,
});
