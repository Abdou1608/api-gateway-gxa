/**
 * Adhésions d’un contrat
 */
export interface Adh {
    /** N° contrat */
    contrat: number;
    /** N° pièce du contrat */
    piece: number;
    /** N° adhésion */
    adhesion: number;
    /** Date d'entrée */
    entree?: Date;
    /** Date de sortie */
    sortie?: Date;
    /** Lié à un risque */
    risklie?: boolean;
    /** Prime annuelle */
    prime?: number;
    /** Prime annuelle (ISO 4217) */
    prime1?: string;
    /** Tiers concerné */
    numtiers?: number;
    /** Motif sortie */
    motif?: string;
    /** Panier de garanties choisi */
    panier?: string;
  }
  export enum AdhMotif {
    RDPPMOTIF = 'RDPPMOTIF'
  }
  export const AdhTagMap: Record<keyof Adh, string> = {
    contrat: 'N° contrat',
    piece: 'N° pièce du contrat',
    adhesion: 'N° adhésion',
    entree: "Date d'entrée",
    sortie: 'Date de sortie',
    risklie: 'Lié à un risque',
    prime: 'Prime annuelle',
    prime1: 'Prime annuelle (ISO 4217)',
    numtiers: 'Tiers concerné',
    motif: 'Motif sortie',
    panier: 'Panier de garanties choisi',
  };