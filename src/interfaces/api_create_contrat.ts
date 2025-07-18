export interface api_create_contrat {
  dossier:number;
  //obligatoire) : numéro de client (vérification présence record dans table CLI)
produit :string ;
 // obligatoire) : code produit de la nouvelle pièce
Effet:Date;
 // par défaut: anydate du jour) : date d'effet de la pièce: any;
}
