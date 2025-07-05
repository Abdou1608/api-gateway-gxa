export interface Tier {
  Numtiers: number;
  Typtiers?: string;
  Nattiers?: string;
  Numdpp?: number;
  Titre?: string;
  Rsociale?: string;
  Referenc?: string;
  Connexe?: string;
  Refext?: string;
  Adr1?: string;
  Adr2?: string;
  Adr3?: string;
  Codp?: string;
  ville?: string;
  Codepays?: string;
  Pays?: string;
  Ntel?: string;
  Nfax?: string;
  Numemail?: string;
  Memo?: string;
  Ext?: string;
  Images?: string;
  Titnom?: string;
  Gommette?: string;
  Ole?: string;
  Titrecou?: string;
  Datdermo?: Date;
  Modifpar?: string;
  Nbpercha?: number;
  Const?: string;
  Histo?: string;
  Adrinsee?: boolean;
  Adresse1?: string;
  Adresse2?: string;
  Adresse3?: string;
  Grcok?: boolean;
  Nonepur?: boolean;
  Territory?: string;
  Latitude?: number;
  Longitude?: number;
}


export class Tier implements Tier {
  [key: string]: any;

  constructor(data?: Partial<Tier>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toJSON(): Partial<Tier> {
    const result: Partial<Tier> = {};
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        result[key as keyof Tier] = this[key];
      }
    }
    return result;
  }
}



export const TierTagMap: Record<keyof Tier, string> = {
  Numtiers: 'N° de tiers',
  Typtiers: 'type de tiers',
  Nattiers: 'type de personne  ( P ou M )',
  Numdpp: 'Numéro de personne physique',
  Titre: 'titre',
  Rsociale: 'Nom-prénom',
  Referenc: 'référence de classement',
  Connexe: 'nom connexe',
  Refext: 'Référence externe (Cie,etc...)',
  Adr1: 'Numéro et voie',
  Adr2: 'auxiliaire de voie',
  Adr3: 'Lieu dit',
  Codp: 'code postal',
  ville: 'bureau distributeur',
  Codepays: 'Code Pays',
  Pays: 'pays',
  Ntel: 'téléphone domicile',
  Nfax: 'fax domicile',
  Numemail: 'E mail internet domicile',
  Memo: 'commentaires',
  Ext: 'Liste des extensions',
  Images: 'Images',
  Titnom: 'Titre, nom, prénom',
  Gommette: 'gommette',
  Ole: 'ole',
  Titrecou: 'titre pour courriers',
  Datdermo: 'date de dernière modif',
  Modifpar: 'modifié par',
  Nbpercha: 'nb de personnes à charge',
  Const: 'constante : "T"',
  Histo: 'Historique des modifications',
  Adrinsee: 'Adresse au format INSEE',
  Adresse1: 'Adresse 1',
  Adresse2: 'Adresse 2',
  Adresse3: 'Adresse 3',
  Grcok: 'Grc migrée en volume',
  Nonepur: 'A conserver si épuration',
  Territory: 'Territoire',
  Latitude: 'Latitude',
  Longitude: 'Longitude',
};


  
  
