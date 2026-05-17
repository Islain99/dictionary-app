# Déploiement — Dictionary App

## Architecture de production

```
Utilisateur
    │
    ▼
Vercel (frontend React/Vite)
    │  appels API vers
    ▼
Heroku (backend Express)
    │  appels aux APIs externes
    ├──▶ TranslatePlus API
    └──▶ DictionaryAPI (dictionaryapi.dev)
```

---

## Backend — Heroku

### Prérequis
- Compte Heroku : https://heroku.com
- Heroku CLI installé : https://devcenter.heroku.com/articles/heroku-cli

### Étapes

```bash
cd backend

# 1. Se connecter à Heroku
heroku login

# 2. Créer l'application Heroku
heroku create mon-dictionnaire-api

# 3. Configurer les variables d'environnement (jamais de .env sur Heroku)
heroku config:set TRANSLATE_API_KEY=votre_cle_translateplus
heroku config:set FRONTEND_URL=https://votre-app.vercel.app
heroku config:set NODE_ENV=production

# 4. Déployer
git add .
git commit -m "deploy: configuration Heroku"
git push heroku main

# 5. Vérifier que le serveur tourne
heroku logs --tail
curl https://mon-dictionnaire-api.herokuapp.com/health
```

### Points importants
- Le `Procfile` indique à Heroku comment démarrer : `web: node server.js`
- Heroku injecte automatiquement la variable `PORT` — ne pas la fixer à 5000 en prod
- `server.set('trust proxy', 1)` est requis pour que le rate limiting fonctionne derrière le proxy Heroku
- Le plan gratuit Heroku a été supprimé — utilisez le plan **Eco** (~5$/mois) ou **Basic**

### Vérification CORS
Après déploiement du frontend, mettez à jour `FRONTEND_URL` sur Heroku :
```bash
heroku config:set FRONTEND_URL=https://votre-vrai-domaine.vercel.app
```

---

## Frontend — Vercel

### Prérequis
- Compte Vercel : https://vercel.com
- CLI Vercel (optionnel) : `npm i -g vercel`

### Option A — Via l'interface Vercel (recommandé)

1. Pushez votre code sur GitHub
2. Sur vercel.com → "New Project" → importer votre repo
3. Sélectionnez le dossier `frontend` comme **Root Directory**
4. Framework : **Vite**
5. Dans "Environment Variables", ajoutez :
   - `VITE_BACKEND_URL` = `https://mon-dictionnaire-api.herokuapp.com`
6. Cliquez "Deploy"

### Option B — Via CLI

```bash
cd frontend

# 1. Modifier .env.production avec votre URL Heroku réelle
# VITE_BACKEND_URL=https://mon-dictionnaire-api.herokuapp.com

# 2. Builder et déployer
vercel --prod
```

### Points importants
- `vercel.json` redirige toutes les routes vers `index.html` (nécessaire pour le routage SPA)
- Les assets sont mis en cache 1 an (`immutable`) pour de meilleures performances
- `VITE_BACKEND_URL` doit commencer par `VITE_` pour être accessible dans le code Vite
- `.env.production` est chargé automatiquement lors du `npm run build`

---

## Checklist de déploiement

### Backend (Heroku)
- [ ] `Procfile` présent à la racine du dossier backend
- [ ] `TRANSLATE_API_KEY` configurée dans les variables Heroku
- [ ] `FRONTEND_URL` configurée avec l'URL Vercel finale
- [ ] `NODE_ENV=production` configuré
- [ ] Route `/health` répond 200
- [ ] `heroku logs --tail` sans erreurs au démarrage

### Frontend (Vercel)
- [ ] `vercel.json` présent à la racine du dossier frontend
- [ ] `VITE_BACKEND_URL` configurée dans les variables Vercel
- [ ] `.env.production` contient l'URL Heroku correcte
- [ ] Build réussi (`npm run build` sans erreurs)
- [ ] La recherche d'un mot fonctionne en production
- [ ] La traduction fonctionne en production

---

## Dépannage fréquent

| Problème | Cause probable | Solution |
|---|---|---|
| Erreur CORS en prod | `FRONTEND_URL` incorrecte sur Heroku | `heroku config:set FRONTEND_URL=https://votre-app.vercel.app` |
| 503 sur le backend | App Heroku endormie (plan Eco) | Attendre ~30s au premier appel |
| Traduction ne fonctionne pas | `VITE_BACKEND_URL` pointe vers localhost | Vérifier les variables d'env sur Vercel |
| Page blanche sur Vercel | Routage SPA mal configuré | Vérifier que `vercel.json` est bien présent |
| Rate limit déclenché trop tôt | Heroku proxy mal configuré | Vérifier `server.set('trust proxy', 1)` dans server.js |
