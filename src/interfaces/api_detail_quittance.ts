export interface api_detail_quittance {
  quittance:number;
  //obligatoire) : numéro interne quittance
details?:boolean;
 // optionnel) : si True: any;
 // toues infos sur quittance sinon: any;seulements les id
	garanties?:boolean;
 // optionnel) : si True: any;
  //détail primes par garantie
	addinfospqg?:boolean;
  //optionnel) : si True: any;
  //ajout de 4 champs "externes" sur chaque ligne pqg:
	//external_cie_nomcie" (i.e. CIE_B_NOMCIE)
	//external_opt_affiche (i.e. OPT_B_AFFICHE)
	//external_opt_codegar" (i.e. OPT_B_CODEGAR)
	//external_opt_libelle" (i.e. OPT_B_LIBELLEE)
	intervenants?:boolean;
 // optionnel) : si True: any;
  //détail des intervenants (QINT)
	addinfosqint?:boolean;
 // optionnel) : si True: any;
 // ajout d'un champ "externe" sur chaque ligne qint
	//external_qint_rsociale" (i.e. TIERS.B_RSOCIALE): any;
}
