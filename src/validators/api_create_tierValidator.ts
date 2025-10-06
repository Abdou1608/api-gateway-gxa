import { z } from 'zod';
import { DpmFieldTagMap } from '../Model/dpm.model';

export const xtlogObjectSchema = z.object({
    Numtiers: z.number().optional(),
    Ordreext: z.number().optional(),
    Site: z.string().optional(),
    Login: z.string().optional(),
    password: z.string().optional(),
    Role: z.string().optional(),
    Util: z.string().optional(),
    dercon: z.preprocess(val => val ? new Date(val as any) : undefined, z.date().optional()),
    nbconn: z.number().optional(),
    Email: z.string().optional(),
    envoye: z.boolean().optional(),
    mdpclair: z.string().optional(),
    court: z.number().optional(),
  });

// Schéma Tier détaillé
export const tierObjectSchema = z.object({
  Numtiers: z.number().optional(),
  Typtiers: z.string().optional(),
  Nattiers: z.string().optional(),
  Numdpp: z.number().optional(),
  Titre: z.string().optional(),
  Rsociale: z.string().optional(),
  Referenc: z.string().optional(),
  Connexe: z.string().optional(),
  Refext: z.string().optional(),
  Adr1: z.string().optional(),
  Adr2: z.string().optional(),
  Adr3: z.string().optional(),
  Codp: z.string().optional(),
  ville: z.string().optional(),
  Codepays: z.string().optional(),
  Pays: z.string().optional(),
  Ntel: z.string().optional(),
  Nfax: z.string().optional(),
  Numemail: z.string().optional(),
  Memo: z.string().optional(),
  Ext: z.string().optional(),
  Images: z.string().optional(),
  Titnom: z.string().optional(),
  Gommette: z.string().optional(),
  Ole: z.string().optional(),
  Titrecou: z.string().optional(),
  Datdermo: z.preprocess(val => val ? new Date(val as any) : undefined, z.date().optional()),
  Modifpar: z.string().optional(),
  Nbpercha: z.number().optional(),
  Const: z.string().optional(),
  Histo: z.string().optional(),
  Adrinsee: z.boolean().optional(),
  Adresse1: z.string().optional(),
  Adresse2: z.string().optional(),
  Adresse3: z.string().optional(),
  Grcok: z.boolean().optional(),
  Nonepur: z.boolean().optional(),
  Territory: z.string().optional(),
  Latitude: z.number().optional(),
  Longitude: z.number().optional(),
});

// Schéma DPP minimal selon ce code
export const dppObjectSchema = z.object({
  Numdpp: z.number().optional(),
  Rsociale: z.string().optional(),
  Nom: z.string(),
  Prenom: z.string(),
});
export const dpmObjectSchema = z.object({
  Numdpm: z.number().optional(),
  Rsociale: z.string(),
  Nom: z.string().optional(),});

// Schéma AdresseInsee
export const adresseInseeObjectSchema = z.object({
  BurDist: z.string().optional(),
  CodeBis: z.string().optional(),
  CodePays: z.string().optional(),
  CodePostal: z.string().optional(),
  CompAdr: z.string().optional(),
  INSEElocalite: z.string().optional(),
  INSEEvoie: z.string().optional(),
  LibelleVoie: z.string().optional(),
  Localite: z.string().optional(),
  NumVoie: z.string().optional(),
  Pays: z.string().optional(),
});

// Schéma objects
export const objectsObjectSchema = z.object({
  TIERS: tierObjectSchema,
  DPP: dppObjectSchema.optional(),
  DPM: dpmObjectSchema.optional(),
  XTLOG: xtlogObjectSchema.optional(),
  adresse_insee: adresseInseeObjectSchema.optional(),
});

// Schéma input
export const inputObjectSchema = z.object({
  objects: objectsObjectSchema,
});

// Schéma racine TIERS
export const tiersObjectSchema = z.object({
  input: inputObjectSchema,
});

export const api_Create_tierValidator = z.object({
  BasSecurityContext: z.object({
    _SessionId: z.string().min(1, { message: '_SessionId est requis et ne doit pas être vide' }),
  }),
  typtiers: z.string().min(1, { message: 'typtiers est requis et ne doit pas être vide' }),
  nature: z.string().min(1, { message: 'nature est requis et ne doit pas être vide' }),
  numtiers: z.number().nullable().optional(),
  numdpp: z.number().nullable().optional(),
  data: tiersObjectSchema,
});
