
export enum OripieceCode {
    // Valeurs attendues de ORIPIECE à compléter ici si disponibles
  }
  
  export enum SitpieceCode {
    // Valeurs attendues de SITPIECE à compléter ici si disponibles
  }
  
  export enum FinpieceCode {
    // Valeurs attendues de FINPIECE à compléter ici si disponibles
  }
  
  export interface Piec {
    /** N° contrat */
    contrat: number;
  
    /** N° pièce du contrat */
    piece: number;
  
    /** N° adhésion principale */
    adhprin?: number;
  
    /** Produit */
    codeprod?: string;
  
    /** Origine de la pièce */
    oripiece?: OripieceCode;
  
    /** date effet */
    effet?: string;
  
    /** Situation pièce */
    sitpiece?: SitpieceCode;
  
    /** Date de situation */
    datesit?: string;
  
    /** Date de suspension */
    suspens?: string;
  
    /** Fin de pièce */
    finpiece?: FinpieceCode;
  
    /** Date de fin de pièce */
    datefin?: string;
  
    /** Comptabilité */
    entite?: number;
  
    /** compagnie majeure */
    ciemaj?: number;
  
    /** N° avenant */
    navenant?: string;
  
    /** motif de la pièce */
    motif?: string;
  
    /** indice global d'origine */
    globalor?: string;
  
    /** indice global terme */
    globalte?: string;
  
    /** nb de mois de préavis */
    preavis?: number;
  
    /** commentaires */
    memo?: string;
  
    /** Coefficient commercial */
    coeffcom?: number;
  
    /** Adresse de gestion Cie */
    centre?: string;
  
    /** Heure */
    heure?: string;
  
    /** Date Mise en demeure */
    datemed?: string;
  
    /** Date/Heure Saisie */
    datcreat?: string;
  
    /** Conditions Générales */
    cg?: string;
  }
  