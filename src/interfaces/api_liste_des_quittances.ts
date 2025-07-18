export interface api_liste_des_quittances {
dossier? :number;
 // optionnel numéro de tiers pour quittances du tiers
contrat?: number;
 // optionnel) : numéro de contrat pour quittances d'un contrat si les 2 sont indiqués,dossier est ignoré
}
