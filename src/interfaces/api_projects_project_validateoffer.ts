export interface api_projects_project_validateoffer {
  idproj:number;
  // (obligatoire) : numéro du projet (tarc0).
idoffer :number;
// (obligatoire) : numéro de l'offre validée dans le projet.
effet?: Date;
// (optionnel) : date d'effet de l'AN (ou de l'avenant) : par défaut: date du jour.
Avenant?: boolean;
// (optionnel: True par défaut) : Si True: any;
 // on fait un avenant / Si False: any;
//  on résilie le contrat de départ et on en crée un autre(option uniquement pour les projets d'avenant): any;
}
