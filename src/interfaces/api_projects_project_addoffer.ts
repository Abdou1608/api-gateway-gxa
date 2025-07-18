export interface api_projects_project_addoffer {
  idproj: number;
  //numéro du projet (tarc0)
produit: string ;
//(obligatoire) : code produit du 1er projet du contrat
user?: string ;
//(optionnel) : utilisateur faisant l'ajout
resutXML?: boolean;
// (optionnel: any;
 // true par défaut): any;
}
