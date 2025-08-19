// path: src/app/models/catal.model.ts

/**
 * Modèle généré depuis le XML <catal><data>...</data></catal>.
 * Mis en forme comme le modèle "Clause" : types utilitaires + interface Data + enveloppe + fieldTagMap.
 */

export type DataType =
  | 'ftString'
  | 'ftInteger'
  | 'ftFloat'
  | 'ftCurrency'
  | 'ftMemo'
  | 'ftBoolean';

export interface FieldTag {
  caption: string;
  dataType: DataType;
  length?: number;   // pour ftString(n)
  nullable: boolean;
  persistent: boolean;
  codeTable?: string;
}

/** Données internes du nœud <data> */
export interface CatalData {
  /** num. de compagnie — non nullable */
  cie: number;
  /** code garantie (11) — non nullable */
  prodcie: string;

  /** catégorie (2) */
  catgar: string | null;
  /** type de risque (2) */
  branche: string | null;
  /** suffixe de garantie (6) */
  codesais: string | null;
  /** libellé garantie (40) */
  libelle: string | null;

  /** taux commission (Float) */
  taux: number | null;

  /** Type variation (1) — code table VARIATION */
  variatio: string | null;
  /** Nature (1) — code table NATGAR */
  natgar: string | null;
  /** indice (11) */
  indice: string | null;

  /** Capital garanti (Currency) */
  capital: number | null;
  /** Capital garanti (ISO 4217 currency code) (3) */
  capital1: string | null;

  /** Montant franchise (Currency) */
  franchi: number | null;
  /** Montant franchise (ISO 4217 currency code) (3) */
  franchi1: string | null;

  /** Formule franchise calculée (Memo) */
  formfran: string | null;
  /** type calcul franchise (1) — code table TYPFRAN */
  typfran: string | null;

  /** formule attachée (Memo) */
  formule: string | null;

  /** taux de taxe (pollicitation) (Float) */
  xtaxe: number | null;
  /** Taux comm. (pollicitation) (Float) */
  xcomm: number | null;

  /** Type de prime pol. (1) */
  tartype: string | null;
  /** Franchise (en jours) (Float) */
  jourfran: number | null;
  /** Coefficient (Float) */
  coef: number | null;

  /** Type franchise (1) — code table TYPCALFRAN */
  frantype: string | null;
  /** Base calcul franchise (Float) */
  franbase: number | null;

  /** Franchise max. (Currency) */
  franmax: number | null;
  /** Franchise max. (ISO 4217 currency code) (3) */
  franmax1: string | null;

  /** Expression franchise (80) — Persistent: false */
  libfran: string | null;

  /** Code garantie CSCA (4) — code table CSCACODEG */
  codecsca: string | null;

  /** Délégation de règlement de sinistre (Boolean) */
  delegregsin: boolean | null;
}

/** Enveloppe conforme au XML racine */
export interface Catal {
  data: CatalData;
}

/** Métadonnées par champ (d’après les commentaires du XML) */
export const CatalFieldTagMap: Record<keyof CatalData, FieldTag> = {
  cie:        { caption: 'num. de compagnie',                dataType: 'ftInteger',                nullable: false, persistent: true  },
  prodcie:    { caption: 'code garantie',                    dataType: 'ftString',  length: 11,   nullable: false, persistent: true  },

  catgar:     { caption: 'catégorie',                        dataType: 'ftString',  length: 2,    nullable: true,  persistent: true  },
  branche:    { caption: 'type de risque',                   dataType: 'ftString',  length: 2,    nullable: true,  persistent: true  },
  codesais:   { caption: 'suffixe de garantie',              dataType: 'ftString',  length: 6,    nullable: true,  persistent: true  },
  libelle:    { caption: 'libellé garantie',                 dataType: 'ftString',  length: 40,   nullable: true,  persistent: true  },

  taux:       { caption: 'taux commission',                  dataType: 'ftFloat',                  nullable: true,  persistent: true  },

  variatio:   { caption: 'Type variation',                   dataType: 'ftString',  length: 1,    nullable: true,  persistent: true,  codeTable: 'VARIATION' },
  natgar:     { caption: 'Nature',                           dataType: 'ftString',  length: 1,    nullable: true,  persistent: true,  codeTable: 'NATGAR'    },
  indice:     { caption: 'indice',                           dataType: 'ftString',  length: 11,   nullable: true,  persistent: true  },

  capital:    { caption: 'Capital garanti',                  dataType: 'ftCurrency',               nullable: true,  persistent: true  },
  capital1:   { caption: 'Capital garanti (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },

  franchi:    { caption: 'Montant franchise',                dataType: 'ftCurrency',               nullable: true,  persistent: true  },
  franchi1:   { caption: 'Montant franchise (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },

  formfran:   { caption: 'Formule franchise calculée',       dataType: 'ftMemo',                   nullable: true,  persistent: true  },
  typfran:    { caption: 'type calcul franchise',            dataType: 'ftString',  length: 1,    nullable: true,  persistent: true,  codeTable: 'TYPFRAN'   },

  formule:    { caption: 'formule attachée',                 dataType: 'ftMemo',                   nullable: true,  persistent: true  },

  xtaxe:      { caption: 'taux de taxe (pollicitation)',     dataType: 'ftFloat',                  nullable: true,  persistent: true  },
  xcomm:      { caption: 'Taux comm. (pollicitation)',       dataType: 'ftFloat',                  nullable: true,  persistent: true  },

  tartype:    { caption: 'Type de prime pol.',               dataType: 'ftString',  length: 1,    nullable: true,  persistent: true  },
  jourfran:   { caption: 'Franchise (en jours)',             dataType: 'ftFloat',                  nullable: true,  persistent: true  },
  coef:       { caption: 'Coefficient',                      dataType: 'ftFloat',                  nullable: true,  persistent: true  },

  frantype:   { caption: 'Type franchise',                   dataType: 'ftString',  length: 1,    nullable: true,  persistent: true,  codeTable: 'TYPCALFRAN' },
  franbase:   { caption: 'Base calcul franchise',            dataType: 'ftFloat',                  nullable: true,  persistent: true  },

  franmax:    { caption: 'Franchise max.',                   dataType: 'ftCurrency',               nullable: true,  persistent: true  },
  franmax1:   { caption: 'Franchise max. (ISO 4217 currency code)', dataType: 'ftString', length: 3, nullable: true, persistent: true },

  libfran:    { caption: 'Expression franchise',             dataType: 'ftString',  length: 80,   nullable: true,  persistent: false },

  codecsca:   { caption: 'Code garantie CSCA',               dataType: 'ftString',  length: 4,    nullable: true,  persistent: true,  codeTable: 'CSCACODEG'  },

  delegregsin:{ caption: 'Délégation de règlement de sinistre', dataType: 'ftBoolean',           nullable: true,  persistent: true  },
};
