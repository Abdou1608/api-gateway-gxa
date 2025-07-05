export enum ContintRole {
    // TODO: Remplacer par les valeurs exactes de la table de code CONTROLE
  }
  
  export interface ContintModel {
    id: number;
    contrat?: number;
    numdpp?: number;
    role?: ContintRole;
  }
  