"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const auth_middleware_1 = require("../middleware/auth.middleware");
const ajout_piece_au_contrat_routes_1 = __importDefault(require("./ajout_piece_au_contrat.routes"));
const check_session_routes_1 = __importDefault(require("./check_session.routes"));
const create_contrat_routes_1 = __importDefault(require("./create_contrat.routes"));
const create_quittance_routes_1 = __importDefault(require("./create_quittance.routes"));
const create_reglement_routes_1 = __importDefault(require("./create_reglement.routes"));
const create_tier_routes_1 = __importDefault(require("./create_tier.routes"));
const detail_contrat_routes_1 = __importDefault(require("./detail_contrat.routes"));
const detail_adhesion_routes_1 = __importDefault(require("./detail_adhesion.routes"));
const detail_produit_routes_1 = __importDefault(require("./detail_produit.routes"));
const detail_quittance_routes_1 = __importDefault(require("./detail_quittance.routes"));
const detail_tier_routes_1 = __importDefault(require("./detail_tier.routes"));
const liste_des_contrats_routes_1 = __importDefault(require("./liste_des_contrats.routes"));
const liste_des_contrats_d_un_tier_routes_1 = __importDefault(require("./liste_des_contrats_d_un_tier.routes"));
const liste_des_produits_routes_1 = __importDefault(require("./liste_des_produits.routes"));
const liste_des_quittances_routes_1 = __importDefault(require("./liste_des_quittances.routes"));
//import liste_des_tiers from './liste_des_tiers.routes';
const login_routes_1 = __importDefault(require("./login.routes"));
const logout_routes_1 = __importDefault(require("./logout.routes"));
const profile_routes_1 = __importDefault(require("./profile.routes"));
const recherche_tier_routes_1 = __importDefault(require("./recherche_tier.routes"));
const update_contrat_routes_1 = __importDefault(require("./update_contrat.routes"));
const project_routes_1 = __importDefault(require("./project.routes"));
const update_piece_du_contrat_routes_1 = __importDefault(require("./update_piece_du_contrat.routes"));
const tab_routes_1 = __importDefault(require("./tab.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const liste_des_tecrants_routes_1 = __importDefault(require("./liste_des_tecrants.routes"));
const sinistre_routes_1 = __importDefault(require("./sinistre.routes"));
const admin_routes_1 = __importStar(require("./admin.routes"));
function registerRoutes(app) {
    const swaggerDocument = yamljs_1.default.load("./openapi.fr.ex.custom.yaml");
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
    // Public
    app.use("/api/login", login_routes_1.default);
    app.use("/api/logout", logout_routes_1.default);
    // Admin (header-guarded by default)
    app.use("/api/admin", admin_routes_1.default);
    app.use("/api/admin/pending-queue/ui", admin_routes_1.queueUiRouter);
    app.use("/api/admin/soap-audit/ui", admin_routes_1.auditUiRouter);
    // Local-only debug exposure (no admin guard) when not in production
    if (process.env.NODE_ENV !== 'production') {
        // Re-expose admin router and queue UI under /debug for local dashboards without admin headers
        app.use('/debug/admin', admin_routes_1.default);
        app.use('/debug/pending-queue/ui', admin_routes_1.queueUiRouter);
        app.use('/debug/soap-audit/ui', admin_routes_1.auditUiRouter);
    }
    // Protected (auth middleware first)
    app.use("/api/ajout_piece_au_contrat", auth_middleware_1.authMiddleware, ajout_piece_au_contrat_routes_1.default);
    app.use("/api/check_session", auth_middleware_1.authMiddleware, check_session_routes_1.default);
    app.use("/api/create_contrat", auth_middleware_1.authMiddleware, create_contrat_routes_1.default);
    app.use("/api/create_quittance", auth_middleware_1.authMiddleware, create_quittance_routes_1.default);
    app.use("/api/create_reglement", auth_middleware_1.authMiddleware, create_reglement_routes_1.default);
    app.use("/api/create_tier", auth_middleware_1.authMiddleware, create_tier_routes_1.default);
    app.use("/api/detail_contrat", auth_middleware_1.authMiddleware, detail_contrat_routes_1.default);
    app.use("/api/detail_adhesion", auth_middleware_1.authMiddleware, detail_adhesion_routes_1.default);
    app.use("/api/detail_produit", auth_middleware_1.authMiddleware, detail_produit_routes_1.default);
    app.use("/api/detail_quittance", auth_middleware_1.authMiddleware, detail_quittance_routes_1.default);
    app.use("/api/detail_tier", auth_middleware_1.authMiddleware, detail_tier_routes_1.default);
    app.use("/api/liste_des_contrats", auth_middleware_1.authMiddleware, liste_des_contrats_routes_1.default);
    app.use("/api/liste_des_contrats_d_un_tier", auth_middleware_1.authMiddleware, liste_des_contrats_d_un_tier_routes_1.default);
    app.use("/api/liste_des_produits", auth_middleware_1.authMiddleware, liste_des_produits_routes_1.default);
    app.use("/api/liste_des_types_ecrans", auth_middleware_1.authMiddleware, liste_des_tecrants_routes_1.default);
    app.use("/api/liste_des_quittances", auth_middleware_1.authMiddleware, liste_des_quittances_routes_1.default);
    app.use("/api/projects", auth_middleware_1.authMiddleware, project_routes_1.default);
    app.use("/api/sinistres", auth_middleware_1.authMiddleware, sinistre_routes_1.default);
    app.use("/api/tabs", auth_middleware_1.authMiddleware, tab_routes_1.default);
    app.use("/api/profile", auth_middleware_1.authMiddleware, profile_routes_1.default);
    app.use("/api/Tiers_Search", auth_middleware_1.authMiddleware, recherche_tier_routes_1.default);
    app.use("/api/Contrat_Update", auth_middleware_1.authMiddleware, update_contrat_routes_1.default);
    app.use("/api/update_piece_contrat", auth_middleware_1.authMiddleware, update_piece_du_contrat_routes_1.default);
}
