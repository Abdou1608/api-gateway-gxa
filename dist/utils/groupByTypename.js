"use strict";
// src/utils/groupByTypename.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = groupByTypename;
function groupByTypename(input, opts = {}) {
    const { keepUnknown = false } = opts;
    // 1) Normaliser l'entrée en tableau T[]
    let arr;
    if (typeof input === 'string') {
        let parsed;
        try {
            parsed = JSON.parse(input);
        }
        catch {
            throw new Error('JSON invalide fourni à groupByTypename.');
        }
        if (!Array.isArray(parsed)) {
            throw new Error('La chaîne JSON ne représente pas un tableau.');
        }
        arr = parsed;
    }
    else if (Array.isArray(input)) {
        arr = input;
    }
    else {
        throw new Error('groupByTypename attend un tableau ou une chaîne JSON.');
    }
    // 2) Réduction
    const result = {};
    for (const item of arr) {
        if (!item || typeof item !== 'object')
            continue;
        const rawKey = item.typename;
        const key = (typeof rawKey === 'string' ? rawKey.trim() : '');
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
