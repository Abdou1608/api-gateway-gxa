import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
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
import router from './project.routes';
import update_piece_au_contrat from './update_piece_du_contrat.routes';
import tabrouter from './tab.routes';
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import list_des_tecrants from './liste_des_tecrants.routes';
import sinrouter from './sinistre.routes';
import admin, { queueUiRouter, auditUiRouter } from './admin.routes';






export function registerRoutes(app: express.Application) {
  const swaggerDocument = YAML.load("./openapi.fr.ex.custom.yaml");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  // Public
  app.use("/api/login", login);
  app.use("/api/logout", logout);
  // Admin (header-guarded by default)
  app.use("/api/admin", admin);
  app.use("/api/admin/pending-queue/ui", queueUiRouter);
  app.use("/api/admin/soap-audit/ui", auditUiRouter);

  // Local-only debug exposure (no admin guard) when not in production
  if (process.env.NODE_ENV !== 'production') {
    // Re-expose admin router and queue UI under /debug for local dashboards without admin headers
    app.use('/debug/admin', admin);
    app.use('/debug/pending-queue/ui', queueUiRouter);
    app.use('/debug/soap-audit/ui', auditUiRouter);
  }
  // Protected (auth middleware first)
  app.use("/api/ajout_piece_au_contrat", authMiddleware, ajout_piece_au_contrat);
  app.use("/api/check_session", authMiddleware, check_session);
  app.use("/api/create_contrat", authMiddleware, create_contrat);
  app.use("/api/create_quittance", authMiddleware, create_quittance);
  app.use("/api/create_reglement", authMiddleware, create_reglement);
  app.use("/api/create_tier", authMiddleware, create_tier);
  app.use("/api/detail_contrat", authMiddleware, detail_contrat);
  app.use("/api/detail_adhesion", authMiddleware, detail_adhesion);
  app.use("/api/detail_produit", authMiddleware, detail_produit);
  app.use("/api/detail_quittance", authMiddleware, detail_quittance);
  app.use("/api/detail_tier", authMiddleware, detail_tier);
  app.use("/api/liste_des_contrats", authMiddleware, liste_des_contrats);
  app.use("/api/liste_des_contrats_d_un_tier", authMiddleware, liste_des_contrats_d_un_tier);
  app.use("/api/liste_des_produits", authMiddleware, liste_des_produits);
  app.use("/api/liste_des_types_ecrans", authMiddleware, list_des_tecrants);
  app.use("/api/liste_des_quittances", authMiddleware, liste_des_quittances);
  app.use("/api/projects", authMiddleware, router);
  app.use("/api/sinistres", authMiddleware, sinrouter);
  app.use("/api/tabs", authMiddleware, tabrouter);
  app.use("/api/profile", authMiddleware, profile);
  app.use("/api/Tiers_Search", authMiddleware, recherche_tier);
  app.use("/api/Contrat_Update", authMiddleware, update_contrat);
  app.use("/api/update_piece_contrat", authMiddleware, update_piece_au_contrat);
}