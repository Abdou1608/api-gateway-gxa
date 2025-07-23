import { Cont } from "./cont.model";
import { Piec } from "./piec.model";

  
  export interface PoliObject {
    Cie?: any | null;
    Cieprime?: any | null;
    Cietaxes?: any | null;
    Commsup?: any | null;
    Contrat?: any | null;
    Coutpol?: any | null;
    Coutpol1?: any | null;
    external_cie_nomcie?: any | null;
    Piece?: any | null;
    PolGroupe?: any | null;
    Police?: any | null;
    Role?: any | null;
    Tauxcn?: any | null;
    Tauxcom?: any | null;
    Tauxcout?: any | null;
    Tauxpart?: any | null;
  }
  
  export interface ContModel {
    CONT?: Cont;
    PIEC?: Piec;
    poli?: PoliObject;
  }
  