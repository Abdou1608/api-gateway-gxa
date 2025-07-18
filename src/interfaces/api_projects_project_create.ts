export interface api_projects_project_create {
  dossier: number;
  // : numéro de dossier client: any;pour une création de projet d’A/N.
contrat: number;
// : numéro de contrat d'origine --> pour les projets d'avenant (prioritaire sur dossier).
produit: string;
// : code produit de la 1ere proposition du projet.
username?: string;
// (optionnel) : utilisateur faisant la création.
libelle?: string ;
//(optionnel) : libellé du projet.
resutXML?: boolean;
// (optionnel: any;true par défaut).: any;
}
