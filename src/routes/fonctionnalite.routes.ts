import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { tokenRevocationPrecheck } from '../middleware/token-revocation-precheck.middleware';
import ajout_piece_au_contrat from './ajout_piece_au_contrat.routes';
import check_session from './check_session.routes';
import create_contrat from './create_contrat.routes';
import create_quittance from './create_quittance.routes';
import create_reglement from './create_reglement.routes';
import create_tier from './create_tier.routes';
import detail_contrat from './detail_contrat.routes';
import detail_adhesion from './detail_adhesion.routes';
import detail_produit from './detail_produit.routes';
import detail_quittance from './detail_quittance.routes';
import detail_tier from './detail_tier.routes';
import liste_des_contrats from './liste_des_contrats.routes';
import liste_des_contrats_d_un_tier from './liste_des_contrats_d_un_tier.routes';
import liste_des_produits from './liste_des_produits.routes';
import liste_des_quittances from './liste_des_quittances.routes';
//import liste_des_tiers from './liste_des_tiers.routes';
import login from './login.routes';
import logout from './logout.routes';
import profile from './profile.routes';
import recherche_tier from './recherche_tier.routes';
import update_contrat from './update_contrat.routes';
import update_tier from './update_tier.routes';
import router from './project.routes';
import update_piece_au_contrat from './update_piece_du_contrat.routes';
import tabrouter from './tab.routes';
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import riskrouter from './risque.routes';
import list_des_tecrants from './liste_des_tecrants.routes';






export function registerRoutes(app: express.Application) {
  const swaggerDocument = YAML.load("./openapi.fr.ex.custom.yaml");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  // Public
  app.use("/api/login", login);
  app.use("/api/logout", logout);
  // Protected (auth middleware first)
  app.use("/api/ajout_piece_au_contrat", authMiddleware, tokenRevocationPrecheck, ajout_piece_au_contrat);
  app.use("/api/check_session", authMiddleware, tokenRevocationPrecheck, check_session);
  app.use("/api/create_contrat", authMiddleware, tokenRevocationPrecheck, create_contrat);
  app.use("/api/create_quittance", authMiddleware, tokenRevocationPrecheck, create_quittance);
  app.use("/api/create_reglement", authMiddleware, tokenRevocationPrecheck, create_reglement);
  app.use("/api/create_tier", authMiddleware, tokenRevocationPrecheck, create_tier);
  app.use("/api/detail_contrat", authMiddleware, tokenRevocationPrecheck, detail_contrat);
  app.use("/api/detail_adhesion", authMiddleware, tokenRevocationPrecheck, detail_adhesion);
  app.use("/api/detail_produit", authMiddleware, tokenRevocationPrecheck, detail_produit);
  app.use("/api/detail_quittance", authMiddleware, tokenRevocationPrecheck, detail_quittance);
  app.use("/api/detail_tier", authMiddleware, tokenRevocationPrecheck, detail_tier);
  app.use("/api/liste_des_contrats", authMiddleware, tokenRevocationPrecheck, liste_des_contrats);
  app.use("/api/liste_des_contrats_d_un_tier", authMiddleware, tokenRevocationPrecheck, liste_des_contrats_d_un_tier);
  app.use("/api/liste_des_produits", authMiddleware, tokenRevocationPrecheck, liste_des_produits);
  app.use("/api/liste_des_types_ecrans", authMiddleware, tokenRevocationPrecheck, list_des_tecrants);
  app.use("/api/liste_des_quittances", authMiddleware, tokenRevocationPrecheck, liste_des_quittances);
  app.use("/api/projects", authMiddleware, tokenRevocationPrecheck, router);
  app.use("/api/tabs", authMiddleware, tokenRevocationPrecheck, tabrouter);
  app.use("/api/risk", authMiddleware, tokenRevocationPrecheck, riskrouter);
  app.use("/api/profile", authMiddleware, tokenRevocationPrecheck, profile);
  app.use("/api/Tiers_Search", authMiddleware, tokenRevocationPrecheck, recherche_tier);
  app.use("/api/Contrat_Update", authMiddleware, tokenRevocationPrecheck, update_contrat);
  app.use("/api/Tiers_Update", authMiddleware, tokenRevocationPrecheck, update_tier);
  app.use("/api/update_piece_contrat", authMiddleware, tokenRevocationPrecheck, update_piece_au_contrat);
}