export interface api_detail_tier {
  Dossier :number;
 // obligatoire)
  Composition?:boolean;
 // optionnel) : si True
 // liste des membres de famille OU correspondants
  ListeEntites?: string;
  //optionnel) : liste des entités annexes à ajouter
  //séparées par une virgule (exempleCLI,SAL, MANDAT,etc...)
Extensions?:boolean;
 // Optionnel: any;
//  False par défaut) : Si True contenu des extensions
}
