"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = groupByTypename;
/**
 * Regroupe les objets par leur typename.
 * - Le 1er élément d'un groupe est stocké directement (objet)
 * - Dès qu'il y a un 2e élément pour le même typename, on convertit en tableau
 * - Pour les éléments sans typename (si keepUnknown=true), on les place dans Produit (toujours un array)
 */
function groupByTypename(input, opts = {}) {
    const { keepUnknown = false } = opts;
    // 1) Normaliser l'entrée en tableau T[]
    let arr;
    if (typeof input === 'string') {
        try {
            const parsed = JSON.parse(input);
            if (Array.isArray(parsed)) {
                arr = parsed;
            }
            else if (parsed && typeof parsed === 'object') {
                arr = [parsed];
            }
            else {
                arr = [];
            }
        }
        catch {
            arr = [];
        }
    }
    else {
        arr = input;
    }
    // 2) Réduction
    const result = {};
    for (const item of arr) {
        if (!item || typeof item !== 'object')
            continue;
        const key = (item.typename ?? item.__typename);
        if (!key) {
            // Pas de typename
            if (keepUnknown) {
                if (!Array.isArray(result.Produit))
                    result.Produit = [];
                result.Produit.push(item);
            }
            continue;
        }
        const existing = result[key];
        if (existing === undefined) {
            // 1er élément pour ce typename → on stocke l'objet lui-même
            result[key] = item;
        }
        else if (Array.isArray(existing)) {
            // Déjà un tableau → on empile
            existing.push(item);
        }
        else {
            // Était un objet unique → on convertit en tableau
            result[key] = [existing, item];
        }
    }
    return result;
}
