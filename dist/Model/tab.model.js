"use strict";
// tab.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldsTagName = exports.createTab = exports.TabFieldTags = void 0;
/** fieldTagMap (métadonnées pour chaque propriété) */
exports.TabFieldTags = {
    tabcode: { caption: 'code table', dataType: 'ftString', nullable: false, persistent: true },
    tabref: { caption: 'code référence', dataType: 'ftString', nullable: false, persistent: true },
    tabval: { caption: 'valeur', dataType: 'ftString', nullable: true, persistent: true },
    tabaff: { caption: 'valeur affichée', dataType: 'ftString', nullable: true, persistent: true },
    valref: { caption: 'Valeur et référence', dataType: 'ftString', nullable: true, persistent: true },
};
/** Fabrique un objet avec valeurs par défaut */
const createTab = (init) => ({
    tabcode: '',
    tabref: '',
    ...init,
});
exports.createTab = createTab;
/** Enum des noms de champs tels qu’ils apparaissent dans <param name="..."> */
var FieldsTagName;
(function (FieldsTagName) {
    FieldsTagName["Tabaff"] = "Tabaff";
    FieldsTagName["Tabcode"] = "Tabcode";
    FieldsTagName["Tabref"] = "Tabref";
    FieldsTagName["Tabval"] = "Tabval";
    FieldsTagName["Valref"] = "Valref";
})(FieldsTagName || (exports.FieldsTagName = FieldsTagName = {}));
