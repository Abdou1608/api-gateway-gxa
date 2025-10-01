"use strict";
// src/app/models/dpm.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvColl = exports.Statutju = exports.DpmFieldTagMap = void 0;
/* -------------------------------------------------------------------------- */
/*  FieldTagMap dérivé des commentaires                                       */
/* -------------------------------------------------------------------------- */
exports.DpmFieldTagMap = {
    Numtiers: { caption: 'Numéro de tiers', dataType: 'ftInteger', nullable: false, persistent: true },
    Statutju: { caption: 'statut juridique', dataType: 'ftString', nullable: true, persistent: true },
    Capital: { caption: 'capital', dataType: 'ftCurrency', nullable: true, persistent: true },
    Capital1: { caption: 'capital (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Nsiret: { caption: 'Numéro siret', dataType: 'ftString', nullable: true, persistent: true },
    Nrc: { caption: 'Numéro RC', dataType: 'ftString', nullable: true, persistent: true },
    Nrm: { caption: 'Numéro RM', dataType: 'ftString', nullable: true, persistent: true },
    Codeape: { caption: 'Code N A F', dataType: 'ftString', nullable: true, persistent: true },
    Lieuimm: { caption: "Lieu d'immatriculation", dataType: 'ftString', nullable: true, persistent: true },
    Tvaintra: { caption: 'TVA intracommunautaire', dataType: 'ftString', nullable: true, persistent: true },
    Datecre: { caption: 'Date de création', dataType: 'ftDateTime', nullable: true, persistent: true },
    Nbetabli: { caption: "Nombre d'établissements", dataType: 'ftInteger', nullable: true, persistent: true },
    Nbsalar: { caption: 'Nombre de salariés', dataType: 'ftInteger', nullable: true, persistent: true },
    Nbcadre: { caption: 'Nombre de cadres', dataType: 'ftInteger', nullable: true, persistent: true },
    Noncadre: { caption: 'Nombre de non cadres', dataType: 'ftInteger', nullable: true, persistent: true },
    Groupe: { caption: 'filiale de', dataType: 'ftInteger', nullable: true, persistent: true },
    Partic: { caption: 'participation de la mère', dataType: 'ftFloat', nullable: true, persistent: true },
    Annee1: { caption: 'année 1', dataType: 'ftString', nullable: true, persistent: true },
    Annee2: { caption: 'année 2', dataType: 'ftString', nullable: true, persistent: true },
    Annee3: { caption: 'année 3', dataType: 'ftString', nullable: true, persistent: true },
    Salair1: { caption: 'masse salariale 1', dataType: 'ftCurrency', nullable: true, persistent: true },
    Salair11: { caption: 'masse salariale 1 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Salair2: { caption: 'masse salariale 2', dataType: 'ftCurrency', nullable: true, persistent: true },
    Salair21: { caption: 'masse salariale 2 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Salair3: { caption: 'masse salariale 3', dataType: 'ftCurrency', nullable: true, persistent: true },
    Salair31: { caption: 'masse salariale 3 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Caht1: { caption: 'C.A. H.T année 1', dataType: 'ftCurrency', nullable: true, persistent: true },
    Caht11: { caption: 'C.A. H.T année 1 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Caht2: { caption: 'C.A. H.T. année 2', dataType: 'ftCurrency', nullable: true, persistent: true },
    Caht21: { caption: 'C.A. H.T. année 2 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Caht3: { caption: 'C.A. H.T. année 3', dataType: 'ftCurrency', nullable: true, persistent: true },
    Caht31: { caption: 'C.A. H.T. année 3 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Marge1: { caption: 'marge brute 1', dataType: 'ftCurrency', nullable: true, persistent: true },
    Marge11: { caption: 'marge brute 1 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Marge2: { caption: 'marge brute 2', dataType: 'ftCurrency', nullable: true, persistent: true },
    Marge21: { caption: 'marge brute 2 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Marge3: { caption: 'marge brute 3', dataType: 'ftCurrency', nullable: true, persistent: true },
    Marge31: { caption: 'marge brute 3 (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Entite: { caption: 'entité juridique (si banque)', dataType: 'ftString', nullable: true, persistent: true },
    Emetteur: { caption: "n. d'émetteur (si banque)", dataType: 'ftString', nullable: true, persistent: true },
    Compteba: { caption: 'num. comptable banque', dataType: 'ftString', nullable: true, persistent: true },
    Interl: { caption: 'Interlocuteur privilégié', dataType: 'ftInteger', nullable: true, persistent: true },
    Activite: { caption: 'Activité commerciale', dataType: 'ftString', nullable: true, persistent: true },
    Convcol: { caption: 'Convention collective', dataType: 'ftString', nullable: true, persistent: true },
    Url: { caption: 'site internet', dataType: 'ftString', nullable: true, persistent: true },
    Expert: { caption: 'Expert comptable', dataType: 'ftInteger', nullable: true, persistent: true },
    Debexe: { caption: 'Début exercice comptable JJ/MM', dataType: 'ftString', nullable: true, persistent: true },
    Finexe: { caption: 'Fin exercice comptable JJ/MM', dataType: 'ftString', nullable: true, persistent: true },
    Numeroconvcol: { caption: 'Numéro de convention collective', dataType: 'ftString', nullable: true, persistent: true },
    Numerobrochure: { caption: 'Numéro de Brochure', dataType: 'ftString', nullable: true, persistent: true },
    Oriasregistrationid: { caption: 'N. immatriculation ORIAS', dataType: 'ftString', nullable: true, persistent: true },
    Rbelastupdate: { caption: 'Date derniere consultation du RBE', dataType: 'ftDateTime', nullable: true, persistent: true },
};
var Statutju;
(function (Statutju) {
    Statutju["SARL"] = "SARL";
    Statutju["SAS"] = "SAS";
    Statutju["SA"] = "SA";
    Statutju["EI"] = "EI";
})(Statutju || (exports.Statutju = Statutju = {}));
var ConvColl;
(function (ConvColl) {
    ConvColl["CCN_BTP"] = "BTP";
    ConvColl["CCN_SANTE"] = "Sant\u00E9";
    ConvColl["CCN_COMMERCE"] = "Commerce";
})(ConvColl || (exports.ConvColl = ConvColl = {}));
