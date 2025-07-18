export interface api_create_reglement {
typeoperation:string;
typeenc:string;
//=type encaissement
targetkind:string;
//enum("Tiers","Cont","Quit","Qint");
targetqintid ?:string;
//=id de l'intervenant (optionnel: any;uniquement si targetkind = Qint)
montant:number;
//=montant encaissé
 devise:string;
date?:Date;
//date encaissement (optionnel: par défaut: any; date du jour)
 dateff?:Date;
 // effet encaissement (optionnel)
 reference?:string;
 //=réference complémentaire (optionnel)
tierspayeur?:string
//=nom du tiers payeur (optionnel): any;
}
