"use strict";
// path: src/app/models/catal.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalFieldTagMap = void 0;
/** Métadonnées par champ (d’après les commentaires du XML) */
exports.CatalFieldTagMap = {
    cie: { caption: 'num. de compagnie', dataType: 'ftInteger', nullable: false, persistent: true },
    prodcie: { caption: 'code garantie', dataType: 'ftString', length: 11, nullable: false, persistent: true },
    catgar: { caption: 'catégorie', dataType: 'ftString', length: 2, nullable: true, persistent: true },
    branche: { caption: 'type de risque', dataType: 'ftString', length: 2, nullable: true, persistent: true },
    codesais: { caption: 'suffixe de garantie', dataType: 'ftString', length: 6, nullable: true, persistent: true },
    libelle: { caption: 'libellé garantie', dataType: 'ftString', length: 40, nullable: true, persistent: true },
    taux: { caption: 'taux commission', dataType: 'ftFloat', nullable: true, persistent: true },
    variatio: { caption: 'Type variation', dataType: 'ftString', length: 1, nullable: true, persistent: true, codeTable: 'VARIATION' },
    natgar: { caption: 'Nature', dataType: 'ftString', length: 1, nullable: true, persistent: true, codeTable: 'NATGAR' },
    indice: { caption: 'indice', dataType: 'ftString', length: 11, nullable: true, persistent: true },
    capital: { caption: 'Capital garanti', dataType: 'ftCurrency', nullable: true, persistent: true },
    capital1: { caption: 'Capital garanti (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    franchi: { caption: 'Montant franchise', dataType: 'ftCurrency', nullable: true, persistent: true },
    franchi1: { caption: 'Montant franchise (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    formfran: { caption: 'Formule franchise calculée', dataType: 'ftMemo', nullable: true, persistent: true },
    typfran: { caption: 'type calcul franchise', dataType: 'ftString', length: 1, nullable: true, persistent: true, codeTable: 'TYPFRAN' },
    formule: { caption: 'formule attachée', dataType: 'ftMemo', nullable: true, persistent: true },
    xtaxe: { caption: 'taux de taxe (pollicitation)', dataType: 'ftFloat', nullable: true, persistent: true },
    xcomm: { caption: 'Taux comm. (pollicitation)', dataType: 'ftFloat', nullable: true, persistent: true },
    tartype: { caption: 'Type de prime pol.', dataType: 'ftString', length: 1, nullable: true, persistent: true },
    jourfran: { caption: 'Franchise (en jours)', dataType: 'ftFloat', nullable: true, persistent: true },
    coef: { caption: 'Coefficient', dataType: 'ftFloat', nullable: true, persistent: true },
    frantype: { caption: 'Type franchise', dataType: 'ftString', length: 1, nullable: true, persistent: true, codeTable: 'TYPCALFRAN' },
    franbase: { caption: 'Base calcul franchise', dataType: 'ftFloat', nullable: true, persistent: true },
    franmax: { caption: 'Franchise max.', dataType: 'ftCurrency', nullable: true, persistent: true },
    franmax1: { caption: 'Franchise max. (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    libfran: { caption: 'Expression franchise', dataType: 'ftString', length: 80, nullable: true, persistent: false },
    codecsca: { caption: 'Code garantie CSCA', dataType: 'ftString', length: 4, nullable: true, persistent: true, codeTable: 'CSCACODEG' },
    delegregsin: { caption: 'Délégation de règlement de sinistre', dataType: 'ftBoolean', nullable: true, persistent: true },
};
