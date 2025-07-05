import { QitRole, QitSitCie } from "./quit.model";

export interface QintModel {
    qit: number;
    int: number;
    /** Intervient au titre de */
    role?: QitRole;
    /** N° Police */
    police?: string;
    /** Taux participation */
    tauxpart?: number;
    /** Situation pour cet intervenant */
    sit?: QitSitCie;
    datsit?: Date;
    ppure?: number;
    ppure1?: string;
    comm?: number;
    comm1?: string;
    pnette?: number;
    pnette1?: string;
    catnat?: number;
    catnat1?: string;
    ristec?: number;
    ristec1?: string;
    retro?: number;
    retro1?: string;
    frcie?: number;
    frcie1?: string;
    taxe?: number;
    taxe1?: string;
    ptotale?: number;
    ptotale1?: string;
    soldedu?: number;
    soldedu1?: string;
    commsup?: number;
    bloque?: boolean;
    typretro?: string;
    mretro?: number;
    mretro1?: string;
  }
  