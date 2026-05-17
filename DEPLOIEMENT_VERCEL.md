# Déploiement — Vercel (frontend + backend serverless)

## Structure du monorepo

```
mon-projet/                  ← racine du repo Git
├── vercel.json              ← configuration Vercel (build + routes)
├── frontend/                ← app React/Vite
│   ├── .env.production      ← VITE_BACKEND_URL vide (même domaine)
│   ├── src/
│   │   ├── App.js
│   │   ├── hooks/
│   │   └── components/
│   └── package.json
└── api/                     ← fonctions serverless
    ├── translate.js         ← POST /api/translate
    ├── detect.js            ← POST /api/detect
    └── package.json
```

---

## Pourquoi cette structure ?

Sur Vercel, tout fichier dans le dossier `api/` devient automatiquement
une fonction serverless accessible à l'URL `/api/nom-du-fichier`.

Le frontend et le backend sont sur **le même domaine** — donc :
- Pas de problème CORS en production
- `VITE_BACKEND_URL` est vide dans `.env.production`
- Les appels axios font `/api/translate` (relatif, pas absolu)

---

## Déploiement

### Prérequis
- Compte Vercel : https://vercel.com
- Repo GitHub avec la structure ci-dessus

### Étapes — Interface Vercel (recommandé)

1. Pushez votre code sur GitHub

2. Sur vercel.com → **"Add New Project"** → importer votre repo

3. Vercel détecte automatiquement `vercel.json` à la racine

4. Dans **"Environment Variables"**, ajoutez :
   | Nom | Valeur |
   |-----|--------|
   | `TRANSLATE_API_KEY` | votre clé TranslatePlus |
   | `FRONTEND_URL` | `https://votre-app.vercel.app` (après 1er deploy) |

5. Cliquez **"Deploy"**

### Étapes — CLI Vercel

```bash
# À la racine du monorepo
npm i -g vercel
vercel login

# Premier déploiement (preview)
vercel

# Déploiement en production
vercel --prod
```

---

## Variables d'environnement

| Variable | Où | Valeur |
|---|---|---|
| `TRANSLATE_API_KEY` | Vercel dashboard | Votre clé secrète |
| `FRONTEND_URL` | Vercel dashboard | `https://votre-app.vercel.app` |
| `VITE_BACKEND_URL` | `frontend/.env.production` | *(vide)* |
| `VITE_BACKEND_URL` | `frontend/.env.local` | `http://localhost:5000` |

> ⚠️ `TRANSLATE_API_KEY` doit être configurée dans le dashboard Vercel,
> jamais dans un fichier commité.

---

## Développement local

Le dossier `api/` ne tourne pas avec `npm run dev` standard.
Utilisez **Vercel Dev** pour émuler les fonctions serverless en local :

```bash
# À la racine du monorepo
npm i -g vercel
vercel dev
```

Vercel Dev démarre :
- Le frontend Vite sur http://localhost:3000
- Les fonctions serverless sur http://localhost:3000/api/*

Créez `frontend/.env.local` avec :
```
VITE_BACKEND_URL=
```
(vide aussi en local avec `vercel dev`, car tout est sur le même port)

---

## Checklist de déploiement

- [ ] `vercel.json` à la racine du repo
- [ ] Dossier `api/` avec `translate.js`, `detect.js`, `package.json`
- [ ] `frontend/.env.production` avec `VITE_BACKEND_URL=` (vide)
- [ ] `TRANSLATE_API_KEY` configurée dans Vercel dashboard
- [ ] `FRONTEND_URL` configurée dans Vercel dashboard (après 1er deploy)
- [ ] Build réussi dans les logs Vercel
- [ ] `/api/translate` répond 200 (testable avec curl)
- [ ] La traduction fonctionne en production

---

## Tester les fonctions en production

```bash
# Tester /api/translate
curl -X POST https://votre-app.vercel.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "hello world", "target": "fr"}'

# Tester /api/detect
curl -X POST https://votre-app.vercel.app/api/detect \
  -H "Content-Type: application/json" \
  -d '{"text": "bonjour le monde"}'
```

---

## Dépannage fréquent

| Problème | Cause | Solution |
|---|---|---|
| Build échoue | Mauvais `buildCommand` | Vérifier `vercel.json` → `"buildCommand": "cd frontend && npm install && npm run build"` |
| 404 sur `/api/translate` | Fichier mal nommé ou mal placé | Le fichier doit être `api/translate.js` à la racine |
| Erreur CORS | `FRONTEND_URL` incorrect | Mettre à jour dans Vercel dashboard avec l'URL exacte |
| `TRANSLATE_API_KEY` undefined | Variable non configurée | L'ajouter dans Vercel dashboard → Settings → Environment Variables |
| Page blanche | Route SPA mal configurée | Vérifier le dernier `"src": "/(.*)"` dans `vercel.json` |
| Timeout sur les fonctions | API externe lente | Augmenter `maxDuration` dans `vercel.json` (max 60s sur plan gratuit) |
