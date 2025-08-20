"use strict";
// rdiv.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRdiv = exports.RdivFieldTags = void 0;
/** Métadonnées des champs (fieldTagMap) */
exports.RdivFieldTags = {
    risque: { caption: 'risque associé', dataType: 'ftInteger', nullable: false, persistent: true },
    numdiv: { caption: 'N° risque divers', dataType: 'ftInteger', nullable: true, persistent: true },
    descrip: { caption: 'description générale', dataType: 'ftMemo', nullable: true, persistent: true },
};
/** Fabrique un objet avec valeurs par défaut */
const createRdiv = (init) => ({
    risque: 0,
    ...init,
});
exports.createRdiv = createRdiv;
