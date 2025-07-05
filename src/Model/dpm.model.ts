export interface DpmModel {
    /** Numéro de tiers */
    numtiers: number;
  
    /** statut juridique */
    statutju?: Statutju;
  
    /** capital */
    capital?: number;
  
    /** capital (ISO 4217 currency code) */
    capital1?: string;
  
    /** Numéro siret */
    nsiret?: string;
  
    /** Numéro RC */
    nrc?: string;
  
    /** Numéro RM */
    nrm?: string;
  
    /** Code N A F */
    codeape?: string;
  
    /** Lieu d'immatriculation */
    lieuimm?: string;
  
    /** TVA intracommunautaire */
    tvaintra?: string;
  
    /** Date de création */
    datecre?: string;
  
    /** Nombre d'établissements */
    nbetabli?: number;
  
    /** Nombre de salariés */
    nbsalar?: number;
  
    /** Nombre de cadres */
    nbcadre?: number;
  
    /** Nombre de non cadres */
    noncadre?: number;
  
    /** filiale de */
    groupe?: number;
  
    /** participation de la mère */
    partic?: number;
  
    /** année 1 */
    annee1?: string;
  
    /** année 2 */
    annee2?: string;
  
    /** année 3 */
    annee3?: string;
  
    /** masse salariale 1 */
    salair1?: number;
  
    /** masse salariale 1 (ISO 4217 currency code) */
    salair11?: string;
  
    /** masse salariale 2 */
    salair2?: number;
  
    /** masse salariale 2 (ISO 4217 currency code) */
    salair21?: string;
  
    /** masse salariale 3 */
    salair3?: number;
  
    /** masse salariale 3 (ISO 4217 currency code) */
    salair31?: string;
  
    /** C.A. H.T année 1 */
    caht1?: number;
  
    /** C.A. H.T année 1 (ISO 4217 currency code) */
    caht11?: string;
  
    /** C.A. H.T. année 2 */
    caht2?: number;
  
    /** C.A. H.T. année 2 (ISO 4217 currency code) */
    caht21?: string;
  
    /** C.A. H.T. année 3 */
    caht3?: number;
  
    /** C.A. H.T. année 3 (ISO 4217 currency code) */
    caht31?: string;
  
    /** marge brute 1 */
    marge1?: number;
  
    /** marge brute 1 (ISO 4217 currency code) */
    marge11?: string;
  
    /** marge brute 2 */
    marge2?: number;
  
    /** marge brute 2 (ISO 4217 currency code) */
    marge21?: string;
  
    /** marge brute 3 */
    marge3?: number;
  
    /** marge brute 3 (ISO 4217 currency code) */
    marge31?: string;
  
    /** entité juridique (si banque) */
    entite?: string;
  
    /** n. d'émetteur (si banque) */
    emetteur?: string;
  
    /** num. comptable banque */
    compteba?: string;
  
    /** Interlocuteur privilégié */
    interl?: number;
  
    /** Activité commerciale */
    activite?: string;
  
    /** Convention collective */
    convcol?: ConvColl;
  
    /** site internet */
    url?: string;
  
    /** Expert comptable */
    expert?: number;
  
    /** Début exercice comptable JJ/MM */
    debexe?: string;
  
    /** Fin exercice comptable JJ/MM */
    finexe?: string;
  
    /** Numéro de convention collective */
    numeroconvcol?: string;
  
    /** Numéro de Brochure */
    numerobrochure?: ConvColl;
  
    /** N. immatriculation ORIAS */
    oriasregistrationid?: string;
  
    /** Date derniere consultation du RBE */
    rbelastupdate?: string;
  }
  
  export enum Statutju {
    // from code table STATUTJU
  }
  
  export enum ConvColl {
    // from code table CONVCOLL
  }
  