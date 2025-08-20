"use strict";
// project.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTarc0 = exports.Tarc0FieldTags = void 0;
/** fieldTagMap (métadonnées pour chaque propriété) */
exports.Tarc0FieldTags = {
    numproj: { caption: 'Numéro du projet', dataType: 'ftInteger', nullable: false, persistent: true },
    rub: { caption: 'Etat', dataType: 'ftString', nullable: true, persistent: true },
    libelle: { caption: 'Titre du projet', dataType: 'ftString', nullable: true, persistent: true },
    numtiers: { caption: 'Numéro de tiers', dataType: 'ftInteger', nullable: true, persistent: true },
    creepar: { caption: 'Créateur du projet', dataType: 'ftString', nullable: true, persistent: true },
    datecre: { caption: 'Date de création', dataType: 'ftDateTime', nullable: true, persistent: true },
    modifpar: { caption: 'Modifié par', dataType: 'ftString', nullable: true, persistent: true },
    datdermo: { caption: 'Date dernière ouverture', dataType: 'ftDateTime', nullable: true, persistent: true },
    contrat: { caption: 'Contrat souscrit', dataType: 'ftInteger', nullable: true, persistent: true },
    statut: { caption: 'Etat', dataType: 'ftString', nullable: true, persistent: true },
    titre: { caption: 'titre', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'TITRE' },
    rsociale: { caption: 'Nom-prénom', dataType: 'ftString', nullable: true, persistent: true },
    referenc: { caption: 'référence de classement', dataType: 'ftString', nullable: true, persistent: true },
    adr1: { caption: 'Numéro et voie', dataType: 'ftString', nullable: true, persistent: true },
    adr2: { caption: 'auxiliaire de voie', dataType: 'ftString', nullable: true, persistent: true },
    adr3: { caption: 'Lieu dit', dataType: 'ftString', nullable: true, persistent: true },
    codp: { caption: 'code postal', dataType: 'ftString', nullable: true, persistent: true },
    ville: { caption: 'bureau distributeur', dataType: 'ftString', nullable: true, persistent: true },
    ntel: { caption: 'téléphone domicile', dataType: 'ftString', nullable: true, persistent: true },
    numemail: { caption: 'E mail internet domicile', dataType: 'ftString', nullable: true, persistent: true },
    selnb: { caption: 'Nb. propositions choisies', dataType: 'ftSmallint', nullable: true, persistent: true },
    sel1: { caption: 'N. proposition 1', dataType: 'ftInteger', nullable: true, persistent: true },
    sel2: { caption: 'N. proposition 2', dataType: 'ftInteger', nullable: true, persistent: true },
    sel3: { caption: 'N. proposition 3', dataType: 'ftInteger', nullable: true, persistent: true },
    sel4: { caption: 'N. proposition 4', dataType: 'ftInteger', nullable: true, persistent: true },
    sel5: { caption: 'N. proposition 5', dataType: 'ftInteger', nullable: true, persistent: true },
    contori: { caption: 'Contrat origine', dataType: 'ftInteger', nullable: true, persistent: true },
    pieceori: { caption: 'Piece origine', dataType: 'ftInteger', nullable: true, persistent: true },
};
/** Fabrique un objet avec valeurs par défaut */
const createTarc0 = (init) => ({
    numproj: 0,
    ...init,
});
exports.createTarc0 = createTarc0;
