"use strict";
// path: src/app/models/compo.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompoFieldTagMap = void 0;
/** Métadonnées par champ (d’après les commentaires du XML) */
exports.CompoFieldTagMap = {
    numopt: { caption: 'N° option garantie', dataType: 'ftInteger', nullable: false, persistent: true },
    cie: { caption: 'code compagnie', dataType: 'ftInteger', nullable: false, persistent: true },
    prodcie: { caption: 'code produit compagnie', dataType: 'ftString', length: 11, nullable: true, persistent: true },
    taux: { caption: 'taux', dataType: 'ftFloat', nullable: true, persistent: true },
    nomcie: { caption: 'nom compagnie', dataType: 'ftString', length: 30, nullable: true, persistent: false },
};
