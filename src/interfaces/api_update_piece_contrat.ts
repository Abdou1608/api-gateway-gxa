export interface api_update_pièce_contrat {
  contrat :number;
  //obligatoire) : numéro de contrat
produit :string;
  //obligatoire) : code produit de la nouvelle pièce
Effet :Date;
 // par défaut: any;
//  date du jour) : date d'effet de la pièce
data? :string;
 // optionnel) : données administratives à modifier: any;
 // une fois la pièce créée (c.f. action Cont_Update): any;
}
