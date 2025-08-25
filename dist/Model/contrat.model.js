"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contrat = exports.ContratTagMap = void 0;
exports.ContratTagMap = {
    contrat: 'N° contrat',
    numcont: 'N° contrat',
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
class Contrat {
    constructor(data) {
        if (data) {
            Object.assign(this, data);
            Object.assign(this.numcont, data.contrat);
        }
    }
    toJSON() {
        const obj = {};
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                obj[key] = this[key];
            }
        }
        return obj;
    }
}
exports.Contrat = Contrat;
