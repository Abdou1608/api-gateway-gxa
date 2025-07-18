export interface api_create_quittance {
  contrat:number;
  //obligatoire) : numéro interne du contrat cible
piece:number;
//  obligatoire) : numéro de la piece du contrat cible
bordereau :number;
 // obligatoire) : numéro du bordereau cible  
 data :string
 // flux XML de toutes les informations de la quittance à crée: any;
}
