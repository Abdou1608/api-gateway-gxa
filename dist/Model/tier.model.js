"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TierTagMap = exports.Tier = void 0;
class Tier {
    constructor(data) {
        if (data) {
            Object.assign(this, data);
        }
    }
    toJSON() {
        const result = {};
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                result[key] = this[key];
            }
        }
        return result;
    }
}
exports.Tier = Tier;
exports.TierTagMap = {
    Numtiers: 'N° de tiers',
    Typtiers: 'type de tiers',
    Nattiers: 'type de personne  ( P ou M )',
    Numdpp: 'Numéro de personne physique',
    Titre: 'titre',
    Rsociale: 'Nom-prénom',
    Referenc: 'référence de classement',
    Connexe: 'nom connexe',
    Refext: 'Référence externe (Cie,etc...)',
    Adr1: 'Numéro et voie',
    Adr2: 'auxiliaire de voie',
    Adr3: 'Lieu dit',
    Codp: 'code postal',
    ville: 'bureau distributeur',
    Codepays: 'Code Pays',
    Pays: 'pays',
    Ntel: 'téléphone domicile',
    Nfax: 'fax domicile',
    Numemail: 'E mail internet domicile',
    Memo: 'commentaires',
    Ext: 'Liste des extensions',
    Images: 'Images',
    Titnom: 'Titre, nom, prénom',
    Gommette: 'gommette',
    Ole: 'ole',
    Titrecou: 'titre pour courriers',
    Datdermo: 'date de dernière modif',
    Modifpar: 'modifié par',
    Nbpercha: 'nb de personnes à charge',
    Const: 'constante : "T"',
    Histo: 'Historique des modifications',
    Adrinsee: 'Adresse au format INSEE',
    Adresse1: 'Adresse 1',
    Adresse2: 'Adresse 2',
    Adresse3: 'Adresse 3',
    Grcok: 'Grc migrée en volume',
    Nonepur: 'A conserver si épuration',
    Territory: 'Territoire',
    Latitude: 'Latitude',
    Longitude: 'Longitude',
};
