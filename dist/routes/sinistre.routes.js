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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sinistreService = __importStar(require("../services/sinistre.service"));
const Validators = __importStar(require("../validators"));
const zodValidator_1 = require("../middleware/zodValidator");
const async_handler_1 = require("../middleware/async-handler");
const sinrouter = (0, express_1.Router)();
// NOTE: Validators names may need sync with actual exported validator constants. Adjust if mismatch..api_sinistres_sinistre
sinrouter.post('/sinistre_listitems', (0, async_handler_1.asyncHandler)(sinistreService.Sinistre_ListItemsHandler));
sinrouter.post('/sinistre_detail', (0, zodValidator_1.validateBody)(Validators.api_sinistres_sinistre_detailValidator), (0, async_handler_1.asyncHandler)(sinistreService.Sinistre_DetailHandler));
sinrouter.post('/sinistre_create', (0, zodValidator_1.validateBody)(Validators.api_sinistres_sinistre_createValidator), (0, async_handler_1.asyncHandler)(sinistreService.Sinistre_CreateHandler));
sinrouter.post('/sinistre_update', (0, zodValidator_1.validateBody)(Validators.api_sinistres_sinistre_updateValidator), (0, async_handler_1.asyncHandler)(sinistreService.Sinistre_updateHandler));
exports.default = sinrouter;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
