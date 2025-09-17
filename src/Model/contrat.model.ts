export interface Contrat {
    contrat?: any;
    numcont?:any;
    numtiers?: any;
    frac?: any;
    echpjj?: any;
    echpmm?: any;
    intitule?: any;
    affnouv?: any;
    tacite?: any;
    prelev?: any;
    prelbank?: any;
    jourp?: any;
    querab?: any;
    realis?: any;
    apport1?: any;
    apport2?: any;
    tauxrea?: any;
    tauxap1?: any;
    tauxap2?: any;
    gestionn?: any;
    portef?: any;
    remplace?: any;
    remppar?: any;
    derpiece?: any;
    memo?: any;
    ext?: any;
    primann?: any;
    primann1?: any;
    commann?: any;
    commann1?: any;
    totann?: any;
    totann1?: any;
    dateresi?: any;
    debcours?: any;
    fincours?: any;
    debsuiv?: any;
    finsuiv?: any;
    debann?: any;
    finann?: any;
    nbsin?: any;
    impaye?: any;
    impaye1?: any;
    acompte?: any;
    acompte1?: any;
    netimp?: any;
    netimp1?: any;
    lima?: any;
    retrorea?: any;
    retroap1?: any;
    retroap2?: any;
    kprretro?: any;
    kprretem?: any;
    retroemi?: any;
    datdermo?: any;
    modifpar?: any;
    ole?: any;
    txcomm?: any;
    comges?: any;
    polinter?: any;
    polrefus?: any;
    modrev?: any;
    sansquit?: any;
    duree?: any;
    modegest?: any;
    echu?: any;
    echeance?: any;
    ddebpiec?: any;
    dfinpiec?: any;
    hono?: any;
    hono1?: any;
    frprel?: any;
    frprel1?: any;
    datereal?: any;
    histo?: any;
    typretrr?: any;
    typretr1?: any;
    typretr2?: any;
    ptini?: any;
    ptini1?: any;
    pnini?: any;
    pnini1?: any;
    comini?: any;
    comini1?: any;
    agelimit?: any;
    fiscal?: any;
    numproj?: any;
    propproj?: any;
    archive?: any;
    indic?: any;
    nonepur?: any;
    mandat?: any;
    prevsusp?: any;
    prevresi?: any;
    fvahom?: any;
    daterefindice?: any;
    typesignature?: any;
    [key: string]: any;
  }
  export interface Contint {
    contrat?: any;
    numcont?:any;
    numtiers?: any;
    frac?: any;
    echpjj?: any;
    echpmm?: any;
    intitule?: any;
    affnouv?: any;
    tacite?: any;
    prelev?: any;
    prelbank?: any;
    jourp?: any;
    querab?: any;
    realis?: any;
    apport1?: any;
    apport2?: any;
    tauxrea?: any;
    tauxap1?: any;
    tauxap2?: any;
    gestionn?: any;
    portef?: any;
    remplace?: any;
    remppar?: any;
    derpiece?: any;
    memo?: any;
    ext?: any;
    primann?: any;
    primann1?: any;
    commann?: any;
    commann1?: any;
    totann?: any;
    totann1?: any;
    dateresi?: any;
    debcours?: any;
    fincours?: any;
    debsuiv?: any;
    finsuiv?: any;
    debann?: any;
    finann?: any;
    nbsin?: any;
    impaye?: any;
    impaye1?: any;
    acompte?: any;
    acompte1?: any;
    netimp?: any;
    netimp1?: any;
    lima?: any;
    retrorea?: any;
    retroap1?: any;
    retroap2?: any;
    kprretro?: any;
    kprretem?: any;
    retroemi?: any;
    datdermo?: any;
    modifpar?: any;
    ole?: any;
    txcomm?: any;
    comges?: any;
    polinter?: any;
    polrefus?: any;
    modrev?: any;
    sansquit?: any;
    duree?: any;
    modegest?: any;
    echu?: any;
    echeance?: any;
    ddebpiec?: any;
    dfinpiec?: any;
    hono?: any;
    hono1?: any;
    frprel?: any;
    frprel1?: any;
    datereal?: any;
    histo?: any;
    typretrr?: any;
    typretr1?: any;
    typretr2?: any;
    ptini?: any;
    ptini1?: any;
    pnini?: any;
    pnini1?: any;
    comini?: any;
    comini1?: any;
    agelimit?: any;
    fiscal?: any;
    numproj?: any;
    propproj?: any;
    archive?: any;
    indic?: any;
    nonepur?: any;
    mandat?: any;
    prevsusp?: any;
    prevresi?: any;
    fvahom?: any;
    daterefindice?: any;
    typesignature?: any;
    [key: string]: any;
  }
  
  export const ContratTagMap: Record<keyof Contrat, string> = {
    contrat: 'N° contrat',
    numcont:'N° contrat',
    numtiers: 'N° tiers',
    frac: 'Fractionnement',
    echpjj: 'éch. princ. (JJ)',
    echpmm: 'ech. princ. (MM)',
    intitule: 'appellation courante contrat',
    affnouv: 'Date affaire nouvelle',
    tacite: 'Sans tacite reconduction',
    prelev: 'Code prélèvement',
    prelbank: 'Banque pour prélèvement',
    jourp: 'jour du prélèvement',
    querab: 'Adresse de quérabilité',
    realis: 'réalisateur',
    apport1: '1er apporteur',
    apport2: '2eme apporteur',
    tauxrea: 'TX rétrocession réalisateur',
    tauxap1: 'TX rétrocession apporteur 1',
    tauxap2: 'TX rétrocession apporteur 2',
    gestionn: 'Gestionnaire',
    portef: 'portefeuille',
    remplace: 'Remplace le contrat',
    remppar: 'Remplacé par le contrat',
    derpiece: 'Derniere pièce',
    memo: 'commentaires',
    ext: 'extensions',
    primann: 'Prime nette annuelle',
    primann1: 'Prime nette annuelle (ISO 4217 currency code)',
    commann: 'Commission annuelle',
    commann1: 'Commission annuelle (ISO 4217 currency code)',
    totann: 'Prime totale annuelle',
    totann1: 'Prime totale annuelle (ISO 4217 currency code)',
    dateresi: 'date de résiliation',
    debcours: 'Début période en cours',
    fincours: 'Fin période en cours',
    debsuiv: 'Début période suivante',
    finsuiv: 'Fin période suivante',
    debann: 'Début période anniversaire',
    finann: 'Fin période anniversaire',
    nbsin: 'nombre de sinistres',
    impaye: 'impayés',
    impaye1: 'impayés (ISO 4217 currency code)',
    acompte: 'acomptes',
    acompte1: 'acomptes (ISO 4217 currency code)',
    netimp: 'net impayé',
    netimp1: 'net impayé (ISO 4217 currency code)',
    lima: 'n. ordre contrat LIMA',
    retrorea: 'Scénario rétro. réalisateur',
    retroap1: 'Scénario rétro. apporteur 1',
    retroap2: 'Scénario rétro. apporteur 2',
    kprretro: 'Proc. rétrocession commission',
    kprretem: 'Procédure rétro. émission',
    retroemi: "Rétrocession à l'émission",
    datdermo: 'date de dernière modif',
    modifpar: 'modifié par',
    ole: 'Porte-documents',
    txcomm: 'taux comm. attendue',
    comges: 'dont comm. de gestion',
    polinter: 'pollicitation interdite',
    polrefus: 'Nbre de refus pollicitation',
    modrev: 'modalités de revision',
    sansquit: 'Sans suivi de quittances',
    duree: 'durée contractuelle',
    modegest: 'Mode gestion',
    echu: 'terme échu',
    echeance: 'Echéancier',
    ddebpiec: 'Début effet derniere pièce',
    dfinpiec: 'Fin effet derniere pièce',
    hono: 'Montant honoraires',
    hono1: 'Montant honoraires (ISO 4217 currency code)',
    frprel: 'Frais de prélèvement',
    frprel1: 'Frais de prélèvement (ISO 4217 currency code)',
    datereal: 'Date de réalisation',
    histo: 'Historique des modifications',
    typretrr: 'type reversement realisateur',
    typretr1: 'type reversement apporteur1',
    typretr2: 'type reversement apporteur2',
    ptini: 'P.Totale/An à souscription',
    ptini1: 'P.Totale/An à souscription (ISO 4217 currency code)',
    pnini: 'P.Nette/An à souscription',
    pnini1: 'P.Nette/An à souscription (ISO 4217 currency code)',
    comini: 'Com./An à souscription',
    comini1: 'Com./An à souscription (ISO 4217 currency code)',
    agelimit: "Limite d'age contractuelle",
    fiscal: 'Type de fiscalité',
    numproj: 'Projet Tarif rapide',
    propproj: 'Proposition tarif rapide',
    archive: 'Archive',
    indic: 'Indicateur',
    nonepur: 'A conserver si épuration',
    mandat: 'Numero MANDAT',
    prevsusp: 'Date de suspension prévisionnelle',
    prevresi: 'Date de résiliation prévisionnelle',
    fvahom: 'Homologué pour FVA',
    daterefindice: 'Date de valeur des indices',
    typesignature: 'Signature',
  };

  export class Contrat implements Contrat {
  
  
    constructor(data?: Partial<Contrat>) {
      if (data) {
        Object.assign(this, data);
        // Assign numcont if not explicitly provided but contrat present
        if (data.contrat && !this.numcont) {
          this.numcont = data.contrat;
        }
      }
    }
  
    toJSON(): Partial<Contrat> {
      const obj: Partial<Contrat> = {};
      for (const key in this) {
        if (this.hasOwnProperty(key)) {
          obj[key as keyof Contrat] = this[key];
        }
      }
      return obj;
    }
  }
  
  