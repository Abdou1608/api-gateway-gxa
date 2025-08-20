"use strict";
// pb.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPb = exports.PbFieldTags = void 0;
/** Métadonnées des champs (fieldTagMap) */
exports.PbFieldTags = {
    risque: { caption: 'risque tarifé', dataType: 'ftInteger', nullable: false, persistent: true },
    tarif: { caption: 'tarif', dataType: 'ftInteger', nullable: true, persistent: true },
    modif: { caption: 'Date modif', dataType: 'ftDateTime', nullable: true, persistent: true },
    revalo: { caption: 'Date dernière revalo', dataType: 'ftDateTime', nullable: true, persistent: true },
    pnann: { caption: 'prime nette annuelle', dataType: 'ftCurrency', nullable: true, persistent: true },
    pnann1: { caption: 'prime nette annuelle (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
    coman: { caption: 'commission annuelle', dataType: 'ftCurrency', nullable: true, persistent: true },
    coman1: { caption: 'commission annuelle (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
    txann: { caption: 'Taxe annuelle', dataType: 'ftCurrency', nullable: true, persistent: true },
    txann1: { caption: 'Taxe annuelle (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
    cnann: { caption: 'CatNat annuelle', dataType: 'ftCurrency', nullable: true, persistent: true },
    cnann1: { caption: 'CatNat annuelle (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
    ptann: { caption: 'prime totale annuelle', dataType: 'ftCurrency', nullable: true, persistent: false, calcType: 'Permanent' },
    ptann1: { caption: 'prime totale annuelle (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: false, calcType: 'Permanent' },
    avecatt: { caption: 'Avec taxe attentat', dataType: 'ftBoolean', nullable: true, persistent: true },
};
/** Fabrique un objet avec valeurs par défaut cohérentes */
const createPb = (init) => ({
    risque: 0,
    ...init,
});
exports.createPb = createPb;
