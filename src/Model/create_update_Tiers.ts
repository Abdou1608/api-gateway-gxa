
import { Xtlog } from "./xtlog.model";
import { Tier } from './tier.model';

export interface TIERS {
    input: Input;
  }
  
 interface Input {
    objects: Objects;
  }
 interface DPP {
    nom: string;
    prenom: string;
  }
  
 interface Objects {
    TIERS: Tier;
    DPP: DPP;
    XTLOG?: Xtlog;
    adresse_insee?: AdresseInsee;
  }

  
 interface AdresseInsee {
    BurDist: string;
    CodeBis?: string;
    CodePays: string;
    CodePostal: string;
    CompAdr?: string;
    INSEElocalite?: string;
    INSEEvoie?: string;
    LibelleVoie: string;
    Localite: string;
    NumVoie?: string;
    Pays: string;
  }
    