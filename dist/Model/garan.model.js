"use strict";
// path: src/app/models/garan.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaranFieldTagMap = void 0;
/** Métadonnées par champ (d’après les commentaires du XML) */
exports.GaranFieldTagMap = {
    adhesion: { caption: 'N° adhésion', dataType: 'ftInteger', nullable: false, persistent: true },
    numdpp: { caption: 'N° personne (ou 0)', dataType: 'ftInteger', nullable: false, persistent: true },
    numopt: { caption: 'N° option garantie', dataType: 'ftInteger', nullable: false, persistent: true },
    codegar: { caption: 'Code garantie', dataType: 'ftString', length: 11, nullable: true, persistent: false },
    libgar: { caption: 'Libellé', dataType: 'ftString', length: 40, nullable: true, persistent: false },
    indice: { caption: "nature de l'indice", dataType: 'ftString', length: 11, nullable: true, persistent: true },
    vindini: { caption: "valeur initiale d'indice", dataType: 'ftFloat', nullable: true, persistent: true },
    vindice: { caption: 'Indice actuel', dataType: 'ftFloat', nullable: true, persistent: true },
    capini: { caption: 'capital initial', dataType: 'ftCurrency', nullable: true, persistent: true },
    capini1: { caption: 'capital initial (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    capital: { caption: 'Capital actualisé', dataType: 'ftCurrency', nullable: true, persistent: false },
    capital1: { caption: 'Capital actualisé (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: false },
    franini: { caption: 'franchise initiale', dataType: 'ftCurrency', nullable: true, persistent: true },
    franini1: { caption: 'franchise initiale (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    franchi: { caption: 'Franchise actualisée', dataType: 'ftCurrency', nullable: true, persistent: false },
    franchi1: { caption: 'Franchise actualisée (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: false },
    prieff: { caption: "prise d'effet", dataType: 'ftDateTime', nullable: true, persistent: true },
    formfran: { caption: 'Formule franchise calculée', dataType: 'ftMemo', nullable: true, persistent: true },
    souscrip: { caption: 'En souscription (pollicitation', dataType: 'ftBoolean', nullable: true, persistent: true },
    jourfran: { caption: 'Franchise (en jours)', dataType: 'ftFloat', nullable: true, persistent: true },
    coef: { caption: 'Coefficient', dataType: 'ftFloat', nullable: true, persistent: true },
    frantype: { caption: 'Type franchise', dataType: 'ftString', length: 1, nullable: true, persistent: true, codeTable: 'TYPCALFRAN' },
    franbase: { caption: 'Base calcul franchise', dataType: 'ftFloat', nullable: true, persistent: true },
    frmxini: { caption: 'Franchise max. initiale', dataType: 'ftCurrency', nullable: true, persistent: true },
    frmxini1: { caption: 'Franchise max. initiale (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },
    franmax: { caption: 'Franchise max. actualisée', dataType: 'ftCurrency', nullable: true, persistent: false },
    franmax1: { caption: 'Franchise max. actualisée (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: false },
    libfran: { caption: 'expression franchise', dataType: 'ftString', length: 80, nullable: true, persistent: false },
    comp: { caption: "Compléments d'information", dataType: 'ftString', length: 100, nullable: true, persistent: true },
};
