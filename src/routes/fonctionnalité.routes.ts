import express from 'express';
import ajout_pièce_au_contrat from './ajout_pièce_au_contrat.routes';
import check_session from './check_session.routes';
import create_contrat from './create_contrat.routes';
import create_quittance from './create_quittance.routes';
import create_reglement from './create_reglement.routes';
import create_tier from './create_tier.routes';
import detail_contrat from './detail_contrat.routes';
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
import update_pièce_du_contrat from "./update_pièce_du_contrat.routes";

export function registerRoutes(app: express.Application) {
  app.use("/api/ajout_pièce_au_contrat", ajout_pièce_au_contrat);
  app.use("/api/check_session", check_session);
  app.use("/api/create_contrat", create_contrat);
  app.use("/api/create_quittance", create_quittance);
  app.use("/api/create_reglement", create_reglement);
  app.use("/api/create_tier", create_tier);
  app.use("/api/detail_contrat", detail_contrat);
  app.use("/api/detail_produit", detail_produit);
  app.use("/api/detail_quittance", detail_quittance);
  app.use("/api/detail_tier", detail_tier);
  app.use("/api/liste_des_contrats", liste_des_contrats);
  app.use("/api/liste_des_contrats_d_un_tier", liste_des_contrats_d_un_tier);
  app.use("/api/liste_des_produits", liste_des_produits);
  app.use("/api/liste_des_quittances", liste_des_quittances);
  app.use("/api/projects", router);
  app.use("/api/login", login);
  app.use("/api/logout", logout);
  app.use("/api/profile", profile);
  app.use("/api/Tiers_Search", recherche_tier);
  app.use("/api/Contrat_Update", update_contrat);
  app.use("/api/Tiers_Update", update_tier);
  app.use("/api/update_pièce_contrat",update_pièce_du_contrat)
}