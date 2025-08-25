
/**
 * Interface représentant un risque assuré.
 */
export interface RisqueModel {
  /** N° risque */
  risque: number;

  /** N° tiers concerné */
  numtiers?: number;

  /** Apellation courante du risque */
  appel?: string;

  /** Liste d'extensions de risque */
  ext?: string;

  /** Chemins vers fichiers images */
  images?: string;

  /** Commentaires */
  memo?: string;

  /** Identification (flottes) */
  identifi?: string;

  /** Zone (autre qu'automobile) */
  zone?: string;

  /** Critère de tarification */
  tarif?: string;

  /** N° risque d'origine */
  origine?: number;

  /** Date 1ère entrée */
  dateori?: Date;

  /** Centre de gestion */
  centre?: number;

  /** Date de référence du tarif */
  datetar?: Date;

  /** Date réception du B.I.A. */
  datebia?: Date;

  /** Porte documents */
  ole?: string;
}
export const RisqueFieldMap: Record<keyof RisqueModel, string> = {
    risque: 'N° risque',
    numtiers: 'N° tiers concerné',
    appel: 'Apellation courante du risque',
    ext: 'liste d\'extensions de risque',
    images: 'Chemins vers fichiers images',
    memo: 'commentaires',
    identifi: 'identification (flottes)',
    zone: 'Zone (autre qu\'automobile)',
    tarif: 'Critère de tarification',
    origine: 'N° risque d\'origine',
    dateori: 'Date 1ere entrée',
    centre: 'Centre de gestion',
    datetar: 'Date de référence du tarif',
    datebia: 'Date réception du B.I.A.',
    ole: 'Porte documents'
  };
  
  export const RisqueTagMap: Record<string, keyof RisqueModel> = {
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