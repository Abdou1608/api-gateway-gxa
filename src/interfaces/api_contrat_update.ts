export interface api_contrat_update {
  contrat :number;
  //obligatoire) : numéro de contrat

piece ?: any;
 // optionnel) : n. de pièce concernée: any;
 // par défaut derniere piece du contrat
 data :string;
  //obligatoire) : flux XML des données à modifier: any;
}
