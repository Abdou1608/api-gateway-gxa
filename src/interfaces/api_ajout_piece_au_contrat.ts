export interface api_ajout_pièce_au_contrat {
  contrat :number;
  //obligatoire) : numéro de contrat
produit :string;
  //obligatoire) : code produit de la nouvelle pièce
Effet :string;
 // par défaut date du jour) : date d'effet de la pièce
data? :string;
  //optionnel) : données administratives à modifieru
}
