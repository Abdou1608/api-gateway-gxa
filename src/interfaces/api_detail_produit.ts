export interface api_detail_produit {
  code : string;
  //obligatoire : code produit
	options? : boolean;
  //optionnel : détail des garanties
	basecouvs? : boolean;
  //optionnel : détail des niveaux de couverture du produit
	clauses ?: boolean;
  //optionnel : détail des clauses du produit
}
