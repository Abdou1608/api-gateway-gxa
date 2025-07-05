// conatt.model.ts
export enum ConattCodeatt {
    // TODO: Remplacer par les valeurs exactes de la table de code CONATT
  }
  
  export enum Attstatut {
    // TODO: Remplacer par les valeurs exactes de la table de code ATTSTATUT
  }
  
  export interface ConattModel {
    incr: number;
    adhesion: number;
    contrat?: number;
    codeatt?: ConattCodeatt;
    dateatt?: Date;
    recue?: Date;
    commen?: string;
    ficage?: number;
    traite?: Date;
    modifpar?: string;
    statut?: Attstatut;
    idcontratfiles?: number;
  }
  