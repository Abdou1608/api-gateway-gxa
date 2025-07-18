export interface api_liste_des_produits {
  typeecran? : string;
 // optionnel : type d'écran (A1; A2; etc)
	branche? : string;
 // optionnel : branche métier (PL;SA;etc...)
	cie ? : number;
 // optionnel : filtre sur compagnie principale
	entite ? : number;
  //optionnel : filtre sur l'entité comptable
	disponible? : boolean;
 // optionnel : si True;on ignore les produits 'non disponibles';
}
