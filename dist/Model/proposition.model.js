"use strict";
// proposition.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProposition = exports.PropositionFieldTags = void 0;
/** fieldTagMap (métadonnées pour chaque propriété) */
exports.PropositionFieldTags = {
    code: { caption: 'code interne', dataType: 'ftInteger', nullable: false, persistent: true },
    rub: { caption: 'rubrique', dataType: 'ftString', nullable: true, persistent: true },
    propos: { caption: 'Proposition', dataType: 'ftInteger', nullable: true, persistent: true },
    nom_prop: { caption: 'nom proposition', dataType: 'ftString', nullable: true, persistent: true },
    ordre: { caption: "Ordre d'affichage", dataType: 'ftInteger', nullable: true, persistent: true },
    descrip: { caption: 'description', dataType: 'ftMemo', nullable: true, persistent: true },
    prod: { caption: 'code produit', dataType: 'ftString', nullable: true, persistent: true },
    lfrac: { caption: 'Fractionnements', dataType: 'ftString', nullable: true, persistent: true },
    borderea: { caption: 'Bordereau bidon', dataType: 'ftInteger', nullable: true, persistent: true },
    frais: { caption: 'Formule frais bordereau', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'FRAIS' },
    classeur: { caption: 'Classeur devis détail', dataType: 'ftInteger', nullable: true, persistent: true },
    lettre: { caption: 'Lettre devis détail', dataType: 'ftInteger', nullable: true, persistent: true },
};
/** Fabrique un objet avec valeurs par défaut */
const createProposition = (init) => ({
    code: 0,
    ...init,
});
exports.createProposition = createProposition;
