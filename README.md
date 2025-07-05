# SOAP REST Gateway (Node.js + TypeScript)

Ce projet expose une API REST pour chacune des fonctionnalités listées dans un tableau Excel, et traduit dynamiquement les requêtes vers un serveur SOAP.

## 🚀 Installation

```bash
npm install
```

## 🛠️ Démarrage en développement

```bash
npm run dev
```

## 🧪 Build production

```bash
npm run build
npm start
```

## 🔧 Configuration via `.env`

```env
SOAP_ENDPOINT=http://example.com/soap
PORT=3000
```

## 📁 Structure

- `/src/routes/` — Toutes les routes REST
- `/src/services/soap.service.ts` — Communication avec le serveur SOAP
- `/src/middleware/logger.middleware.ts` — Middleware de logging
- `/src/utils/xml-parser.ts` — Conversion XML -> JSON
