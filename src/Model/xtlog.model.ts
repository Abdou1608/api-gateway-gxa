export class Xtlog  {
    /** N° de tiers */
    Numtiers!: number;
  
    /** N° d'ordre extension */
    Ordreext!: number;
  
    /** Site concerné */
    Site?: string;
  
    /** Login utilisateur */
    Login?: string;
  
    /** mot de passe */
    password?: string;
  
    /** Role pour ce login */
    Role?: string;
  
    /** Utilisateur Belair */
    Util?: string;
  
    /** Dernière connexion */
    dercon?: Date;
  
    /** Nombre de connexion */
    nbconn?: number;
  
    /** Email de l'utilisateur */
    Email?: string;
  
    /** Login envoyé à l'utilisateur */
    envoye?: boolean;
  
    /** Mot de passe en clair */
    mdpclair?: string;
  
    /** Identifiant du courtier */
    court?: number;
  }
  
  export const xtlogTagMap: Record<keyof Xtlog, string> = {
    Numtiers: 'numtiers',
    Ordreext: 'ordreext',
    Site: 'site',
    Login: 'login',
    password: 'password',
    Role: 'role',
    Util: 'util',
    dercon: 'dercon',
    nbconn: 'nbconn',
    Email: 'email',
    envoye: 'envoye',
    mdpclair: 'mdpclair',
    court: 'court',
  };
  
  export const xtlogFieldMap: Record<string, keyof Xtlog> = {
    numtiers: 'Numtiers',
    ordreext: 'Ordreext',
    site: 'Site',
    login: 'Login',
    password: 'password',
    role: 'Role',
    util: 'Util',
    dercon: 'dercon',
    nbconn: 'nbconn',
    email: 'Email',
    envoye: 'envoye',
    mdpclair: 'mdpclair',
    court: 'court',
  };
  