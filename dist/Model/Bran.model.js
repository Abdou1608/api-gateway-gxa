"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranFieldTagMap = void 0;
/** Map des métadonnées (captions, types, nullabilité, etc.) */
exports.BranFieldTagMap = {
    branche: { caption: 'type de risque', dataType: 'ftString', length: 2, nullable: false, persistent: true },
    libelle: { caption: 'Libellé', dataType: 'ftString', length: 31, nullable: true, persistent: true },
    nbredpp: { caption: 'Nombre personne(s)', dataType: 'ftSmallint', nullable: true, persistent: true },
    nbreveh: { caption: 'Véhicule (0 ou 1)', dataType: 'ftSmallint', nullable: true, persistent: true },
    nbreimm: { caption: 'immeuble (0 ou 1)', dataType: 'ftSmallint', nullable: true, persistent: true },
    nbrediv: { caption: 'divers (0 ou 1)', dataType: 'ftSmallint', nullable: true, persistent: true },
    multiadh: { caption: 'Avec adhésion multiple', dataType: 'ftBoolean', nullable: true, persistent: true },
    extfixe: { caption: 'extension(s) fixe(s)', dataType: 'ftMemo', nullable: true, persistent: true },
    extobli: { caption: 'Extension(s) obligatoire(s)', dataType: 'ftMemo', nullable: true, persistent: true },
    extdispo: { caption: 'Extension(s) disponible(s)', dataType: 'ftMemo', nullable: true, persistent: true },
    aveccouv: { caption: 'Avec gestion couvertures', dataType: 'ftBoolean', nullable: true, persistent: true },
    garlien: { caption: 'Garanties Risque / Personne', dataType: 'ftString', length: 1, nullable: true, persistent: true },
};
