export interface api_projects_project_update {
  idproj: number;
  // (obligatoirel) : numéro du projet.
username?: string;
// (optionnel) : utilisateur faisant la modification.
libelle?:  string ;
//(optionnel) : libellé du projet.
resutXML?: boolean
// (optionnel true par défaut).: any;
}
