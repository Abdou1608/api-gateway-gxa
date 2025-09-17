/**
 * Generated from openapi.fr.ex.custom.yaml - DO NOT EDIT MANUALLY
 */
export interface StandardSuccess {
  ok: boolean;
}

export interface ErrorResponse {
  error: string;
  details?: Record<string, any>;
}

export interface SoapFaultError extends ErrorResponse {
  [key: string]: any;
}

export interface LoginResponse {
  BasSecurityContext: Record<string, any>;
}

export interface ContratSummary {
  id: number;
  produit: string;
  effet: string;
  statut?: string;
}

export interface TiersSummary {
  reference: string;
  typetiers: number;
  libelle?: string;
}

export interface QuittanceSummary {
  id: number;
  contrat: number;
  montant: number;
  devise?: string;
  effet?: string;
}

export interface ReglementSummary {
  id: number;
  typeoperation: string;
  montant: number;
  devise?: string;
  date?: string;
}

export interface OfferSummary {
  idoffer: number;
  produit: string;
  effet?: string;
}

export interface ProjectSummary {
  idproj: number;
  libelle?: string;
  username?: string;
}

export interface ValidationErrorDetail {
  champ: string;
  message: string;
}

export interface ValidationErrorResponse {
  erreur: string;
  details: ValidationErrorDetail[];
}

export interface LoginInput {
  logon: string;
  password: string;
  Domain: string;
}

export interface LogoutInput {
  BasSecurityContext: string;
}

export interface ProfileInput {
  domain: string;
  email: string;
  login: string;
  dossier?: string;
}

export interface ListeDesContratsInput {
  reference: string;
  detailorigine?: boolean;
}

export interface DetailContratInput {
  contrat: number;
  Allpieces: boolean;
  DetailAdh: boolean;
  Garanties: boolean;
  Extensions: boolean;
  infosCieProd: boolean;
}

export interface TiersSearchInput {
  reference: string;
  typetiers?: number;
  detailorigine?: boolean;
}

export interface CreateContratInput {
  dossier: number;
  produit: string;
  Effet: string;
}

export interface CreateQuittanceInput {
  contrat: number;
  piece: number;
  bordereau: number;
  data: string;
}

export interface CreateReglementInput {
  typeoperation: string;
  typeenc: string;
  targetkind: string;
  targetqintid?: string;
  montant: number;
  devise: string;
  date?: string;
  dateff?: string;
  reference?: string;
  tierspayeur?: string;
}

export interface DetailProduitInput {
  code: string;
  clauses?: boolean;
}

export interface DetailQuittanceInput {
  quittance: number;
  details?: boolean;
  garanties?: boolean;
  addinfospqg?: boolean;
  intervenants?: boolean;
  addinfosqint?: boolean;
}

export interface DetailTierInput {
  Dossier: number;
  Composition?: boolean;
  ListeEntites?: string;
  Extensions?: boolean;
}

export interface ListeDesContratsDUnTierInput {
  dossier: number;
  IncludeAll: boolean;
}

export interface ListeDesProduitsInput {

}

export interface ListeDesQuittancesInput {
  contrat?: number;
}

export interface UpdatePieceContratInput {
  contrat: number;
  produit: string;
  Effet: string;
}

export interface ProjectsProjectAddofferInput {
  idproj: number;
  produit: string;
  user?: string;
  resutXML?: boolean;
}

export interface ProjectsProjectCreateInput {
  dossier: number;
  contrat: number;
  produit: string;
  username?: string;
  libelle?: string;
  resutXML?: boolean;
}

export interface ProjectsProjectDeleteofferInput {
  idproj: number;
  idoffer: number;
}

export interface ProjectsProjectDetailInput {
  dproj: number;
}

export interface ProjectsProjectListitemsInput {
  dossier: number;
}

export interface ProjectsProjectOfferlistitemsInput {
  idproj: number;
}

export interface ProjectsProjectUpdateInput {
  idproj: number;
  username?: string;
  libelle?: string;
  resutXML?: boolean;
}

export interface ProjectsProjectValidateofferInput {
  idproj: number;
  idoffer: number;
  effet?: string;
  Avenant?: boolean;
}
