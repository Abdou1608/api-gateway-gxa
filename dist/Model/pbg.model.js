"use strict";
// pbg.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPbg = exports.PbgFieldTags = void 0;
/** Métadonnées des champs (fieldTagMap) */
exports.PbgFieldTags = {
    risque: { caption: 'risque', dataType: 'ftInteger', nullable: false, persistent: true },
    option: { caption: 'option garantie', dataType: 'ftInteger', nullable: false, persistent: true },
    pn: { caption: 'prime nette', dataType: 'ftCurrency', nullable: true, persistent: true },
    pn1: { caption: 'prime nette (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
    ccn: { caption: 'code catnat', dataType: 'ftSmallint', nullable: true, persistent: true },
    xcn: { caption: 'taux catnat', dataType: 'ftFloat', nullable: true, persistent: true },
    cn: { caption: 'Montant Cat/nat', dataType: 'ftCurrency', nullable: true, persistent: true },
    cn1: { caption: 'Montant Cat/nat (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
    xcompn: { caption: 'taux comm/pn', dataType: 'ftFloat', nullable: true, persistent: true },
    xcomcn: { caption: 'taux comm/cn', dataType: 'ftFloat', nullable: true, persistent: true },
    comm: { caption: 'Montant commission', dataType: 'ftCurrency', nullable: true, persistent: true },
    comm1: { caption: 'Montant commission (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
    ctaxe: { caption: 'code taxe', dataType: 'ftInteger', nullable: true, persistent: true },
    xtaxe: { caption: 'Taux de taxe', dataType: 'ftFloat', nullable: true, persistent: true },
    taxe: { caption: 'Montant taxe', dataType: 'ftCurrency', nullable: true, persistent: true },
    taxe1: { caption: 'Montant taxe (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
    valvar: { caption: 'Variation (indice, bonus)', dataType: 'ftFloat', nullable: true, persistent: true },
    txreval: { caption: 'Taux revalo à appliquer', dataType: 'ftFloat', nullable: true, persistent: true },
    ctxcn: { caption: 'Code taxe sur CN', dataType: 'ftSmallint', nullable: true, persistent: true },
    xtxcn: { caption: 'Taux de taxe sur CN', dataType: 'ftFloat', nullable: true, persistent: true },
    primeachat: { caption: 'Prime nette achetée', dataType: 'ftCurrency', nullable: true, persistent: true },
    primeachat1: { caption: 'Prime nette achetée (ISO 4217 currency code)', dataType: 'ftString', nullable: true, persistent: true },
};
/** Fabrique un objet avec valeurs par défaut */
const createPbg = (init) => ({
    risque: 0,
    option: 0,
    ...init,
});
exports.createPbg = createPbg;
