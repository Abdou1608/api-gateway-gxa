"use strict";
// path: src/app/models/clause.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClauseFieldTagMap = void 0;
/** Métadonnées par champ (d’après les commentaires du XML) */
exports.ClauseFieldTagMap = {
    codeprod: { caption: 'code produit lié', dataType: 'ftString', length: 9, nullable: false, persistent: true },
    clause: { caption: 'code clause', dataType: 'ftString', length: 6, nullable: false, persistent: true },
    ordre: { caption: 'N° ordre', dataType: 'ftInteger', nullable: false, persistent: true },
    libelle: { caption: 'libelle clause', dataType: 'ftString', length: 50, nullable: true, persistent: true },
    texte: { caption: 'texte', dataType: 'ftMemo', nullable: true, persistent: true },
    datefin: { caption: 'Date expiration / remplacement', dataType: 'ftDateTime', nullable: true, persistent: true },
};
