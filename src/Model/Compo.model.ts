export interface Compo {
    /** N° option garantie */
    numopt: number;
  
    /** code compagnie */
    cie: number;
  
    /** code produit compagnie */
    prodcie?: string;
  
    /** taux */
    taux?: number;
  
    /** nom compagnie (calculé) */
    readonly nomcie?: string;
  }