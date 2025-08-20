export interface TierDisplay {
  Numtiers: number;         // Numéro unique du tiers
  nom: string;              // Nom (concaténé pour personnes physiques, SIRET pour morales)
  adresse: string;          // Adresse ou lieu d'activité
  type: 'physique' | 'morale';  // Type de tiers
  ville?: string;           // Ville (facultative mais utile pour les filtres)
  icon: string;             // Icône à afficher (Angular Material icon name)
  color: 'primary' | 'accent' | 'warn'; // Couleur pour différencier
}
