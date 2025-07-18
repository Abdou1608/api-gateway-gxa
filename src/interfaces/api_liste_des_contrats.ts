export interface api_liste_des_contrats {
  reference :string;
 // obligatoire) : référence à rechercher
detailorigine?:boolean;
 // optionnel) si False: une balise 'origine' par valeur d'origine si true: any;
  //une balise 'origine' par valeur/codefic/nomchamp: any;
}
