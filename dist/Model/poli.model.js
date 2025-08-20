"use strict";
// poli.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoli = exports.PoliFieldTags = void 0;
/** Métadonnées des champs (fieldTagMap) */
exports.PoliFieldTags = {
    contrat: { caption: 'N° contrat', dataType: 'ftInteger', nullable: false, persistent: true },
    piece: { caption: 'N° pièce', dataType: 'ftInteger', nullable: false, persistent: true },
    cie: { caption: 'code compagnie', dataType: 'ftInteger', nullable: false, persistent: true },
    police: { caption: 'N° police', dataType: 'ftString', nullable: true, persistent: true },
    coutpol: { caption: 'cout police', dataType: 'ftCurrency', nullable: true, persistent: true },
    coutpol1: { caption: 'cout police (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
    tauxpart: { caption: 'taux participation', dataType: 'ftFloat', nullable: true, persistent: true },
    role: { caption: 'Type de police', dataType: 'ftString', nullable: true, persistent: true, codeTable: 'POLIROLE' },
    tauxcom: { caption: 'taux comm. sur PN', dataType: 'ftFloat', nullable: true, persistent: true },
    tauxcn: { caption: 'Taux sur CatNat', dataType: 'ftFloat', nullable: true, persistent: true },
    tauxcout: { caption: 'taux comm. sur coût police', dataType: 'ftFloat', nullable: true, persistent: true },
    cieprime: { caption: 'Cie destinataire des primes', dataType: 'ftInteger', nullable: true, persistent: true },
    cietaxes: { caption: 'Cies destinataire des taxes', dataType: 'ftInteger', nullable: true, persistent: true },
    commsup: { caption: '% commission supplémentaire', dataType: 'ftFloat', nullable: true, persistent: true },
    polgroupe: { caption: 'Numéro Police Groupe', dataType: 'ftString', nullable: true, persistent: true },
    reference: { caption: 'Référence à la compagnie', dataType: 'ftString', nullable: true, persistent: true },
};
/** Fabrique un objet avec valeurs par défaut */
const createPoli = (init) => ({
    contrat: 0,
    piece: 0,
    cie: 0,
    ...init,
});
exports.createPoli = createPoli;
