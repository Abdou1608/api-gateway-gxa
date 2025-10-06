"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_Create_tierValidator = exports.tiersObjectSchema = exports.inputObjectSchema = exports.objectsObjectSchema = exports.adresseInseeObjectSchema = exports.dpmObjectSchema = exports.dppObjectSchema = exports.tierObjectSchema = exports.xtlogObjectSchema = void 0;
const zod_1 = require("zod");
exports.xtlogObjectSchema = zod_1.z.object({
    Numtiers: zod_1.z.number().optional(),
    Ordreext: zod_1.z.number().optional(),
    Site: zod_1.z.string().optional(),
    Login: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    Role: zod_1.z.string().optional(),
    Util: zod_1.z.string().optional(),
    dercon: zod_1.z.preprocess(val => val ? new Date(val) : undefined, zod_1.z.date().optional()),
    nbconn: zod_1.z.number().optional(),
    Email: zod_1.z.string().optional(),
    envoye: zod_1.z.boolean().optional(),
    mdpclair: zod_1.z.string().optional(),
    court: zod_1.z.number().optional(),
});
// Schéma Tier détaillé
exports.tierObjectSchema = zod_1.z.object({
    Numtiers: zod_1.z.number().optional(),
    Typtiers: zod_1.z.string().optional(),
    Nattiers: zod_1.z.string().optional(),
    Numdpp: zod_1.z.number().optional(),
    Titre: zod_1.z.string().optional(),
    Rsociale: zod_1.z.string().optional(),
    Referenc: zod_1.z.string().optional(),
    Connexe: zod_1.z.string().optional(),
    Refext: zod_1.z.string().optional(),
    Adr1: zod_1.z.string().optional(),
    Adr2: zod_1.z.string().optional(),
    Adr3: zod_1.z.string().optional(),
    Codp: zod_1.z.string().optional(),
    ville: zod_1.z.string().optional(),
    Codepays: zod_1.z.string().optional(),
    Pays: zod_1.z.string().optional(),
    Ntel: zod_1.z.string().optional(),
    Nfax: zod_1.z.string().optional(),
    Numemail: zod_1.z.string().optional(),
    Memo: zod_1.z.string().optional(),
    Ext: zod_1.z.string().optional(),
    Images: zod_1.z.string().optional(),
    Titnom: zod_1.z.string().optional(),
    Gommette: zod_1.z.string().optional(),
    Ole: zod_1.z.string().optional(),
    Titrecou: zod_1.z.string().optional(),
    Datdermo: zod_1.z.preprocess(val => val ? new Date(val) : undefined, zod_1.z.date().optional()),
    Modifpar: zod_1.z.string().optional(),
    Nbpercha: zod_1.z.number().optional(),
    Const: zod_1.z.string().optional(),
    Histo: zod_1.z.string().optional(),
    Adrinsee: zod_1.z.boolean().optional(),
    Adresse1: zod_1.z.string().optional(),
    Adresse2: zod_1.z.string().optional(),
    Adresse3: zod_1.z.string().optional(),
    Grcok: zod_1.z.boolean().optional(),
    Nonepur: zod_1.z.boolean().optional(),
    Territory: zod_1.z.string().optional(),
    Latitude: zod_1.z.number().optional(),
    Longitude: zod_1.z.number().optional(),
});
// Schéma DPP minimal selon ce code
exports.dppObjectSchema = zod_1.z.object({
    Numdpp: zod_1.z.number().optional(),
    Rsociale: zod_1.z.string().optional(),
    Nom: zod_1.z.string(),
    Prenom: zod_1.z.string(),
});
exports.dpmObjectSchema = zod_1.z.object({
    Numdpm: zod_1.z.number().optional(),
    Rsociale: zod_1.z.string(),
    Nom: zod_1.z.string().optional(),
});
// Schéma AdresseInsee
exports.adresseInseeObjectSchema = zod_1.z.object({
    BurDist: zod_1.z.string().optional(),
    CodeBis: zod_1.z.string().optional(),
    CodePays: zod_1.z.string().optional(),
    CodePostal: zod_1.z.string().optional(),
    CompAdr: zod_1.z.string().optional(),
    INSEElocalite: zod_1.z.string().optional(),
    INSEEvoie: zod_1.z.string().optional(),
    LibelleVoie: zod_1.z.string().optional(),
    Localite: zod_1.z.string().optional(),
    NumVoie: zod_1.z.string().optional(),
    Pays: zod_1.z.string().optional(),
});
// Schéma objects
exports.objectsObjectSchema = zod_1.z.object({
    TIERS: exports.tierObjectSchema,
    DPP: exports.dppObjectSchema.optional(),
    DPM: exports.dpmObjectSchema.optional(),
    XTLOG: exports.xtlogObjectSchema.optional(),
    adresse_insee: exports.adresseInseeObjectSchema.optional(),
});
// Schéma input
exports.inputObjectSchema = zod_1.z.object({
    objects: exports.objectsObjectSchema,
});
// Schéma racine TIERS
exports.tiersObjectSchema = zod_1.z.object({
    input: exports.inputObjectSchema,
});
exports.api_Create_tierValidator = zod_1.z.object({
    BasSecurityContext: zod_1.z.object({
        _SessionId: zod_1.z.string().min(1, { message: '_SessionId est requis et ne doit pas être vide' }),
    }),
    typtiers: zod_1.z.string().min(1, { message: 'typtiers est requis et ne doit pas être vide' }),
    nature: zod_1.z.string().min(1, { message: 'nature est requis et ne doit pas être vide' }),
    numtiers: zod_1.z.number().nullable().optional(),
    numdpp: zod_1.z.number().nullable().optional(),
    data: exports.tiersObjectSchema,
});
