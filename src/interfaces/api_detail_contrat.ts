export interface api_detail_contrat {
  contrat :number;
 // obligatoire) : numéro contrat
Allpieces :boolean;
  //Défaut=False) : Si True: any; toutes les pieces: any;sinon: any;
  //juste la derniere
DetailAdh :boolean;
  //Défaut=False) : Si True: any;
 // détail sur l'adhésion principale et des tables liées (
 RISA?: string;
  RIMM?: string;
  RVEH?: string;
  RDIV?: string;
  RDPP?:string;
Garanties:boolean;
  //Défaut=False) : Si True: any;
 // liste des garanties de l'adhésion principale (nécessite DetailAdh=True)
Extensions:boolean;
  //Défaut=False) : Si True: any;
 // ajout des extensions contrat (et celles liées au risque si DetailAdh=True)
infosCieProd: boolean;
 // Défaut=False) : Si True: any;
 // ajout des informations CIE: any;
  //PROD et BRAN pour chaque pièce: any;
}
