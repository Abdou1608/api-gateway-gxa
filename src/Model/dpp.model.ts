// dpp.model.ts
export interface Dpp {
    /** N° de personne physique */
    numdpp: number;
  
    /** N° de tiers */
    numtiers?: number;
  
    /** Titre */
    titre?: string;
  
    /** Nom */
    nom?: string;
  
    /** Prénom */
    prenom?: string;
  
    /** Nom et prénom */
    nompre?: string;
  
    /** Nom de jeune fille */
    nomfille?: string;
  
    /** Alias */
    alias?: string;
  
    /** Sexe */
    sexe?: string;
  
    /** date de naissance */
    datenais?: Date;
  
    /** age */
    age?: number;
  
    /** Age millésime */
    agemsme?: number;
  
    /** nationalité */
    national?: string;
  
    /** N° de sécurité sociale */
    numss?: string;
  
    /** Situation familiale */
    sitfam?: string;
  
    /** Activité */
    activite?: string;
  
    /** catégorie professionnelle */
    catprof?: string;
  
    /** Code socio professionnel */
    csp?: string;
  
    /** Profession */
    profess?: string;
  
    /** Employeur */
    employe?: string;
  
    /** Filiale */
    filiale?: string;
  
    /** date entrée dans l'entreprise */
    dateent?: Date;
  
    /** Salaire annuel */
    salaire?: number;
  
    /** Salaire annuel (ISO 4217 currency code) */
    salaire1?: string;
  
    /** Année du salaire annuel */
    datesal?: number;
  
    /** Numéro téléphone professionnel */
    telprof?: string;
  
    /** numéro de poste */
    postetel?: string;
  
    /** numéro de FAX professionnel */
    faxpro?: string;
  
    /** numéro de téléphone portable */
    portable?: string;
  
    /** Numéro du permis de conduire */
    npermis?: string;
  
    /** Permis délivré par : */
    lieuperm?: string;
  
    /** Conduite accompagnée */
    condacc?: boolean;
  
    /** att. conduite accompagnée */
    dateca?: Date;
  
    /** date du permis moto A */
    datemoto?: Date;
  
    /** date du permis auto B */
    datevl?: Date;
  
    /** date du permis Poids-lourds C */
    datepl?: Date;
  
    /** date du permis Transp/Commun D */
    datetc?: Date;
  
    /** photo */
    images?: string;
  
    /** Code région */
    ssregion?: string;
  
    /** Code caisse */
    sscaisse?: string;
  
    /** Centre de paiement */
    sscentre?: string;
  
    /** Enfant d'assuré */
    enfass?: boolean;
  
    /** Salaire tranche A */
    saltra?: number;
  
    /** Salaire tranche A (ISO 4217 currency code) */
    saltra1?: string;
  
    /** Salaire tranche B */
    saltrb?: number;
  
    /** Salaire tranche B (ISO 4217 currency code) */
    saltrb1?: string;
  
    /** Salaire tranche C */
    saltrc?: number;
  
    /** Salaire tranche C (ISO 4217 currency code) */
    saltrc1?: string;
  
    /** Email personnel */
    numemail?: string;
  
    /** Date permis A1 */
    datea1?: Date;
  
    /** Date obtention BSR */
    datebsr?: Date;
  
    /** Organisme d'affiliation */
    orgaffil?: string;
  
    /** Date permis A2 */
    datea2?: Date;
  
    /** Date du permis B1 (Quad) */
    dateb1?: Date;
  
    /** Régime Social */
    regimesocial?: string;
  
    /** Régime Social Local */
    regimelocal?: string;
  
    /** Email professionnel */
    emailprof?: string;
  
    /** Lieu de Naissance */
    lieunaissance?: string;
  
    /** Date d'optention du permis bateau */
    datepermisbateau?: Date;
  
    /** Type de Permis Bateau */
    typepermisbateau?: string;
  
    /** Date Validité Permis Moto */
    datevalvl?: Date;
  }
  export enum DppTitre {
    TITRE = 'TITRE'
  }
  
  export enum DppSexe {
    SEXE = 'SEXE'
  }
  
  export enum DppNational {
    ISO3166 = 'ISO3166'
  }
  
  export enum DppSitfam {
    SITFAM = 'SITFAM'
  }
  
  export enum DppActivite {
    ACTIVITE = 'ACTIVITE'
  }
  
  export enum DppCatprof {
    CATPROF = 'CATPROF'
  }
  
  export enum DppCsp {
    CSP = 'CSP'
  }
  
  
  