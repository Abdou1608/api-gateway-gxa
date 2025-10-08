"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = groupByTypename;
/** Essaie d’extraire un tableau d’objets depuis diverses formes d’entrée */
function normalizeToArray(input) {
    // 1) Déserialiser si string JSON
    let value = input;
    if (typeof input === 'string') {
        try {
            value = JSON.parse(input);
        }
        catch {
            return [];
        }
    }
    // 2) Si c’est déjà un tableau
    if (Array.isArray(value))
        return value;
    // 3) Si c’est un objet
    if (value && typeof value === 'object') {
        const obj = value;
        // 3.a) Cas "objet direct" avec typename / __typename
        if ('typename' in obj || '__typename' in obj) {
            return [obj];
        }
        // 3.b) Cas "objet imbriqué" : chercher une propriété qui est un array d’objets
        const arrayChild = Object.values(obj).find(v => Array.isArray(v));
        if (Array.isArray(arrayChild)) {
            return arrayChild;
        }
        // 3.c) Chercher une propriété qui est un objet avec typename
        const objectChild = Object.values(obj).find(v => v && typeof v === 'object' && ('typename' in v || '__typename' in v));
        if (objectChild && typeof objectChild === 'object') {
            return [objectChild];
        }
        // 3.d) Dernier recours : envelopper l’objet lui-même
        return [obj];
    }
    // 4) Sinon, rien à traiter
    return [];
}
/**
 * Regroupe les objets par leur typename.
 * - Le 1er élément d'un groupe est stocké directement (objet)
 * - Dès qu'il y a un 2e élément pour le même typename, on convertit en tableau
 * - Pour les éléments sans typename (si keepUnknown=true), on les place dans Produit (toujours un array)
 */
function groupByTypename(input, opts = {}) {
    const { keepUnknown = false } = opts;
    // Normaliser en tableau
    const arr = normalizeToArray(input);
    const result = {};
    for (const item of arr) {
        if (!item || typeof item !== 'object')
            continue;
        const key = item.typename ??
            item.__typename;
        if (!key) {
            if (keepUnknown) {
                if (!Array.isArray(result.Notypename))
                    result.Notypename = [];
                result.Notypename.push(item);
            }
            continue;
        }
        const existing = result[key];
        if (existing === undefined) {
            result[key] = item;
        }
        else if (Array.isArray(existing)) {
            existing.push(item);
        }
        else {
            result[key] = [existing, item];
        }
    }
    return result;
}
