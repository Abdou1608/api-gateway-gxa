/**
 * Garanties Souscrites
 */
export interface Garan {
    /** N° adhésion */
    adhesion: number;
    /** N° personne (ou 0) */
    numdpp: number;
    /** N° option garantie */
    numopt: number;
    /** Code garantie */
    readonly codegar?: string;
    /** Libellé */
    readonly libgar?: string;
    /** Nature de l'indice */
    indice?: string;
    /** Valeur initiale d'indice */
    vindini?: number;
    /** Indice actuel */
    vindice?: number;
    /** Capital initial */
    capini?: number;
    /** Capital initial (ISO 4217) */
    capini1?: string;
    /** Capital actualisé */
    readonly capital?: number;
    /** Capital actualisé (ISO 4217) */
    readonly capital1?: string;
    /** Franchise initiale */
    franini?: number;
    /** Franchise initiale (ISO 4217) */
    franini1?: string;
    /** Franchise actualisée */
    readonly franchi?: number;
    /** Franchise actualisée (ISO 4217) */
    readonly franchi1?: string;
    /** Prise d'effet */
    prieff?: Date;
    /** Formule franchise calculée */
    formfran?: string;
    /** En souscription (pollicitation) */
    souscrip?: boolean;
    /** Franchise (en jours) */
    jourfran?: number;
    /** Coefficient */
    coef?: number;
    /** Type franchise */
    frantype?: string;
    /** Base calcul franchise */
    franbase?: number;
    /** Franchise max. initiale */
    frmxini?: number;
    /** Franchise max. initiale (ISO 4217) */
    frmxini1?: string;
    /** Franchise max. actualisée */
    readonly franmax?: number;
    /** Franchise max. actualisée (ISO 4217) */
    readonly franmax1?: string;
    /** Expression franchise */
    readonly libfran?: string;
    /** Compléments d'information */
    comp?: string;
  }
  