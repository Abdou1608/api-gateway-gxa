"use strict";
// src/app/models/dpp.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.DppFieldTagMap = exports.DppCsp = exports.DppCatprof = exports.DppActivite = exports.DppSitfam = exports.DppNational = exports.DppSexe = exports.DppTitre = void 0;
/* -------------------------------------------------------------------------- */
/*  Enums de code-table (conservés)                                            */
/* -------------------------------------------------------------------------- */
var DppTitre;
(function (DppTitre) {
    DppTitre["TITRE"] = "TITRE";
})(DppTitre || (exports.DppTitre = DppTitre = {}));
var DppSexe;
(function (DppSexe) {
    DppSexe["SEXE"] = "SEXE";
})(DppSexe || (exports.DppSexe = DppSexe = {}));
var DppNational;
(function (DppNational) {
    DppNational["ISO3166"] = "ISO3166";
})(DppNational || (exports.DppNational = DppNational = {}));
var DppSitfam;
(function (DppSitfam) {
    DppSitfam["SITFAM"] = "SITFAM";
})(DppSitfam || (exports.DppSitfam = DppSitfam = {}));
var DppActivite;
(function (DppActivite) {
    DppActivite["ACTIVITE"] = "ACTIVITE";
})(DppActivite || (exports.DppActivite = DppActivite = {}));
var DppCatprof;
(function (DppCatprof) {
    DppCatprof["CATPROF"] = "CATPROF";
})(DppCatprof || (exports.DppCatprof = DppCatprof = {}));
var DppCsp;
(function (DppCsp) {
    DppCsp["CSP"] = "CSP";
})(DppCsp || (exports.DppCsp = DppCsp = {}));
/* -------------------------------------------------------------------------- */
/*  FieldTagMap dérivé des commentaires                                       */
/* -------------------------------------------------------------------------- */
exports.DppFieldTagMap = {
    Numdpp: { caption: 'N° de personne physique', dataType: 'ftInteger', nullable: false, persistent: true },
    Numtiers: { caption: 'N° de tiers', dataType: 'ftInteger', nullable: true, persistent: true },
    Titre: { caption: 'Titre', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'DppTitre' },
    Nom: { caption: 'Nom', dataType: 'ftString', nullable: true, persistent: true },
    Prenom: { caption: 'Prénom', dataType: 'ftString', nullable: true, persistent: true },
    Nompre: { caption: 'Nom et prénom', dataType: 'ftString', nullable: true, persistent: true },
    Nomfille: { caption: 'Nom de jeune fille', dataType: 'ftString', nullable: true, persistent: true },
    Alias: { caption: 'Alias', dataType: 'ftString', nullable: true, persistent: true },
    Sexe: { caption: 'Sexe', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'DppSexe' },
    Datenais: { caption: 'Date de naissance', dataType: 'ftDateTime', nullable: true, persistent: true },
    Age: { caption: 'Age', dataType: 'ftInteger', nullable: true, persistent: true },
    Agemsme: { caption: 'Age millésime', dataType: 'ftInteger', nullable: true, persistent: true },
    National: { caption: 'Nationalité', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'DppNational' },
    Numss: { caption: 'N° de sécurité sociale', dataType: 'ftString', nullable: true, persistent: true },
    Sitfam: { caption: 'Situation familiale', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'DppSitfam' },
    Activite: { caption: 'Activité', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'DppActivite' },
    Catprof: { caption: 'Catégorie professionnelle', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'DppCatprof' },
    Csp: { caption: 'Code socio professionnel', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'DppCsp' },
    Profess: { caption: 'Profession', dataType: 'ftString', nullable: true, persistent: true },
    Employe: { caption: 'Employeur', dataType: 'ftString', nullable: true, persistent: true },
    Filiale: { caption: 'Filiale', dataType: 'ftString', nullable: true, persistent: true },
    Dateent: { caption: "Date entrée dans l'entreprise", dataType: 'ftDateTime', nullable: true, persistent: true },
    Salaire: { caption: 'Salaire annuel', dataType: 'ftCurrency', nullable: true, persistent: true },
    Salaire1: { caption: 'Salaire annuel (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Datesal: { caption: 'Année du salaire annuel', dataType: 'ftInteger', nullable: true, persistent: true },
    Telprof: { caption: 'Numéro téléphone professionnel', dataType: 'ftString', nullable: true, persistent: true },
    Postetel: { caption: 'Numéro de poste', dataType: 'ftString', nullable: true, persistent: true },
    Faxpro: { caption: 'Numéro de FAX professionnel', dataType: 'ftString', nullable: true, persistent: true },
    Portable: { caption: 'Numéro de téléphone portable', dataType: 'ftString', nullable: true, persistent: true },
    Npermis: { caption: 'Numéro du permis de conduire', dataType: 'ftString', nullable: true, persistent: true },
    Lieuperm: { caption: 'Permis délivré par :', dataType: 'ftString', nullable: true, persistent: true },
    Condacc: { caption: 'Conduite accompagnée', dataType: 'ftBoolean', nullable: true, persistent: true },
    Dateca: { caption: 'Att. conduite accompagnée', dataType: 'ftDateTime', nullable: true, persistent: true },
    Datemoto: { caption: 'Date du permis moto A', dataType: 'ftDateTime', nullable: true, persistent: true },
    Datevl: { caption: 'Date du permis auto B', dataType: 'ftDateTime', nullable: true, persistent: true },
    Datepl: { caption: 'Date du permis Poids-lourds C', dataType: 'ftDateTime', nullable: true, persistent: true },
    Datetc: { caption: 'Date du permis Transp/Commun D', dataType: 'ftDateTime', nullable: true, persistent: true },
    Images: { caption: 'Photo', dataType: 'ftString', nullable: true, persistent: true },
    Ssregion: { caption: 'Code région', dataType: 'ftString', nullable: true, persistent: true },
    Sscaisse: { caption: 'Code caisse', dataType: 'ftString', nullable: true, persistent: true },
    Sscentre: { caption: 'Centre de paiement', dataType: 'ftString', nullable: true, persistent: true },
    Enfass: { caption: "Enfant d'assuré", dataType: 'ftBoolean', nullable: true, persistent: true },
    Saltra: { caption: 'Salaire tranche A', dataType: 'ftCurrency', nullable: true, persistent: true },
    Saltra1: { caption: 'Salaire tranche A (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Saltrb: { caption: 'Salaire tranche B', dataType: 'ftCurrency', nullable: true, persistent: true },
    Saltrb1: { caption: 'Salaire tranche B (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Saltrc: { caption: 'Salaire tranche C', dataType: 'ftCurrency', nullable: true, persistent: true },
    Saltrc1: { caption: 'Salaire tranche C (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    Numemail: { caption: 'Email personnel', dataType: 'ftString', nullable: true, persistent: true },
    Datea1: { caption: 'Date permis A1', dataType: 'ftDateTime', nullable: true, persistent: true },
    Datebsr: { caption: 'Date obtention BSR', dataType: 'ftDateTime', nullable: true, persistent: true },
    Orgaffil: { caption: "Organisme d'affiliation", dataType: 'ftString', nullable: true, persistent: true },
    Datea2: { caption: 'Date permis A2', dataType: 'ftDateTime', nullable: true, persistent: true },
    Dateb1: { caption: 'Date du permis B1 (Quad)', dataType: 'ftDateTime', nullable: true, persistent: true },
    Regimesocial: { caption: 'Régime Social', dataType: 'ftString', nullable: true, persistent: true },
    Regimelocal: { caption: 'Régime Social Local', dataType: 'ftString', nullable: true, persistent: true },
    Emailprof: { caption: 'Email professionnel', dataType: 'ftString', nullable: true, persistent: true },
    Lieunaissance: { caption: 'Lieu de Naissance', dataType: 'ftString', nullable: true, persistent: true },
    Datepermisbateau: { caption: "Date d'optention du permis bateau", dataType: 'ftDateTime', nullable: true, persistent: true },
    Typepermisbateau: { caption: 'Type de Permis Bateau', dataType: 'ftString', nullable: true, persistent: true },
    Datevalvl: { caption: 'Date Validité Permis Moto', dataType: 'ftDateTime', nullable: true, persistent: true },
};
