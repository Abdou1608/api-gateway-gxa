import { QitNature, QitGestion, Frais } from "./quit.model";

export interface QborModel {
    /** Numéro bordereau */
    numero: number;
    /** Bordereau "modèle" */
    modele?: boolean;
    /** Nom */
    nom?: string;
    /** Entité comptable */
    entite?: number;
    /** Mois */
    mois?: number;
    /** Année */
    annee?: number;
    /** Réservé à la Cie */
    cie?: number;
    /** Nature quittances */
    nature?: QitNature;
    /** Encaissement confié */
    confie?: boolean;
    /** Mode de gestion */
    gestion?: QitGestion;
    /** Bordereau bloqué */
    bloque?: boolean;
    /** Bordereau affecté */
    affecte?: boolean;
    /** Date de débit */
    debit?: Date;
    /** Procédure d'émission */
    emission?: number;
    /** Procédure encaissement */
    encaiss?: number;
    /** sequence */
    sequence?: string;
    /** formule des frais de cabinet */
    fraiscab?: Frais;
    /** date d'enregistrement */
    date_enr?: Date;
    /** nombre de quittances */
    nbquitt?: number;
    /** total émis à encaisser */
    totpte?: number;
    /** ISO 4217 */
    totpte1?: string;
    /** total commissions */
    totcomm?: number;
    totcomm1?: string;
    /** total primes nettes */
    totpn?: number;
    totpn1?: string;
    /** Mode de gestion */
    modegest?: string;
  }
  