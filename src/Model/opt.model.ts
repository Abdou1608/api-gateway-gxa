// path: src/app/models/opt.model.ts

/**
 * Modèle généré depuis <opt><data>...</data></opt>.
 * Harmonisé avec le format "Clause"/"Garan".
 */

export type DataType =
  | 'ftString'
  | 'ftInteger'
  | 'ftFloat'
  | 'ftCurrency'
  | 'ftMemo'
  | 'ftBoolean'
  | 'ftDateTime';

export interface FieldTag {
  caption: string;
  dataType: DataType;
  length?: number;
  nullable: boolean;
  persistent: boolean;
  codeTable?: string;
}

/** Données du nœud <data> */
export interface OptData {
  codeprod: string;           // ftString(9), non-null
  affiche: number;            // ftInteger, non-null
  codegar: string;            // ftString(11), non-null

  numopt: number | null;      // ftInteger
  cieprin: number | null;     // ftInteger
  libelle: string | null;     // ftString(40)
  variatio: string | null;    // ftString(2)
  nomind: string | null;      // ftString(11)

  typegar: string | null;     // ftString(1), code table TYPEGAR
  natgar: string | null;      // ftString(1), code table NATGAR

  tarctaxe: string | null;    // ftString(22)
  tarxtaxe: number | null;    // ftFloat (calc)

  tarcomm: string | null;     // ftString(22)
  tarxcomm: number | null;    // ftFloat (calc)

  tarcn: number | null;       // ftSmallint
  tarcnpn: number | null;     // ftFloat (calc)
  tarcncom: number | null;    // ftFloat (calc)

  tarpnpp: string | null;     // ftString(1)
  tardev: string | null;      // ftString(3)

  tarcntax: number | null;    // ftSmallint (calc)
}

/** Enveloppe conforme au XML racine */
export interface Opt {
  data: OptData;
}

/** Métadonnées par champ (d’après les commentaires du XML) */
export const OptFieldTagMap: Record<keyof OptData, FieldTag> = {
  codeprod: { caption: 'code produit',                 dataType: 'ftString',  length: 9,  nullable: false, persistent: true  },
  affiche:  { caption: 'ordre affichage',              dataType: 'ftInteger',                 nullable: false, persistent: true  },
  codegar:  { caption: 'code gararantie',              dataType: 'ftString',  length: 11, nullable: false, persistent: true  },

  numopt:   { caption: 'N° option',                    dataType: 'ftInteger',                 nullable: true,  persistent: true  },
  cieprin:  { caption: 'Cie principale',               dataType: 'ftInteger',                 nullable: true,  persistent: true  },
  libelle:  { caption: "libellé de l'option",          dataType: 'ftString',  length: 40, nullable: true,  persistent: true  },
  variatio: { caption: 'variation',                    dataType: 'ftString',  length: 2,  nullable: true,  persistent: true  },
  nomind:   { caption: 'nom indice',                   dataType: 'ftString',  length: 11, nullable: true,  persistent: true  },

  typegar:  { caption: 'Type de garanties',            dataType: 'ftString',  length: 1,  nullable: true,  persistent: true,  codeTable: 'TYPEGAR' },
  natgar:   { caption: 'Nature',                       dataType: 'ftString',  length: 1,  nullable: true,  persistent: true,  codeTable: 'NATGAR'  },

  tarctaxe: { caption: 'Code taxe (Tarif)',            dataType: 'ftString',  length: 22, nullable: true,  persistent: true  },
  tarxtaxe: { caption: 'Taux de taxe (Tarif)',         dataType: 'ftFloat',                 nullable: true,  persistent: false },

  tarcomm:  { caption: '% commission (Tarif)',         dataType: 'ftString',  length: 22, nullable: true,  persistent: true  },
  tarxcomm: { caption: 'Taux de comm (tarif)',         dataType: 'ftFloat',                 nullable: true,  persistent: false },

  tarcn:    { caption: 'Code Cat/Nat (tarif)',         dataType: 'ftInteger',               nullable: true,  persistent: true  }, // ftSmallint -> number
  tarcnpn:  { caption: 'Part de Cat/Nat dans PN',      dataType: 'ftFloat',                 nullable: true,  persistent: false },
  tarcncom: { caption: '% commission sur Cat/Nat',     dataType: 'ftFloat',                 nullable: true,  persistent: false },

  tarpnpp:  { caption: 'Prime nette / prime pure',     dataType: 'ftString',  length: 1,  nullable: true,  persistent: true  },
  tardev:   { caption: 'devise spécifique du tarif',   dataType: 'ftString',  length: 3,  nullable: true,  persistent: true  },

  tarcntax: { caption: 'code taxe sur Cat/Nat',        dataType: 'ftInteger',               nullable: true,  persistent: false }, // ftSmallint -> number
};
