# Dictionary App — Guide d'installation et des améliorations

## Structure du projet

```
project/
├── backend/
│   ├── .env                        ← À créer depuis .env.example (jamais commité)
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json                ← npm install express-rate-limit requis
│   ├── server.js                   ← Rate limiting + CORS restreint
│   ├── routes/
│   │   └── dictionary.routes.js    ← Routes /translate et /detect
│   └── controllers/
│       └── dictionary.controllers.js ← Validation + clés sécurisées
│
└── frontend/
    ├── .env.local                  ← À créer depuis .env.example
    ├── .env.example
    ├── App.js                      ← UI uniquement, logique dans les hooks
    ├── hooks/
    │   ├── useDictionary.js        ← Fetch + cache en mémoire
    │   ├── useTranslation.js       ← Traduction + debounce + cache
    │   ├── useAudio.js             ← Lecture audio + gestion du cycle de vie
    │   └── useHistory.js           ← Historique persisté dans localStorage
    └── components/
        ├── SearchBar.js            ← Champ vidé après recherche, bouton désactivé si vide
        ├── Definition.js           ← Phonétique + bouton audio + bloc traduction
        ├── SearchHistory.js        ← Chips cliquables avec suppression animée
        └── i18n.js                 ← FR + EN complets, sans faute de frappe
```

---

## Installation

### Backend

```bash
cd backend

# 1. Copier le fichier d'environnement
cp .env.example .env

# 2. Remplir les vraies clés dans .env
#    TRANSLATE_API_KEY=votre_cle_translateplus
#    FRONTEND_URL=http://localhost:5173

# 3. Installer les dépendances (express-rate-limit est nouveau)
npm install

# 4. Démarrer en développement
npm run dev
```

### Frontend

```bash
cd frontend

# 1. Copier le fichier d'environnement
cp .env.example .env.local

# 2. Vérifier que VITE_BACKEND_URL=http://localhost:5000

# 3. Installer les dépendances
npm install

# 4. Démarrer
npm run dev
```

---

## Bugs corrigés

| Fichier | Bug | Correction |
|---|---|---|
| `App.js` | `import.meta.env.API_KEY` invalide avec Vite | Variable supprimée, clé côté backend uniquement |
| `App.js` | Langue "auto" envoyée à l'API de traduction | Traduction ignorée si `targetLang === 'auto'` |
| `SearchBar.js` | `setWord('')` était commenté | Champ vidé après chaque recherche |
| `SearchBar.js` | Bouton actif même si champ vide | Bouton désactivé si `word.trim()` est vide |
| `i18n.js` | Faute "Tranlate to:" | Corrigé en "Translate to:" |
| `i18n.js` | Clés `synonyms`, `loading`, `translation` manquantes | Toutes les clés ajoutées en FR et EN |
| `routes/index.js` | Fichier inutilisé créant de la confusion | Supprimé — `server.js` importe directement `dictionary.routes.js` |
| `dictionary.controllers.js` | Clé API hardcodée dans le code | Lue depuis `process.env.TRANSLATE_API_KEY` uniquement |

---

## Améliorations apportées

### Sécurité
- Clés API uniquement dans `.env`, jamais dans le code ou le frontend
- Rate limiting : 200 req/15min global, 20 req/min sur `/api`
- Validation des entrées (longueur, langue cible dans liste blanche)
- CORS restreint à l'URL du frontend
- Corps de requête limité à 10kb

### Architecture
- `useDictionary` — fetch + cache en mémoire (zéro requête pour un mot déjà cherché)
- `useTranslation` — debounce 400ms + cache par paire texte/langue
- `useAudio` — gestion propre du cycle de vie audio
- `useHistory` — historique persisté dans localStorage, max 20 entrées
- `App.js` allégé : aucune logique métier, uniquement de l'UI

### Fonctionnalités
- Prononciation audio avec bouton ▶/■ qui pulse pendant la lecture
- Affichage de la phonétique (`/wɜːrd/`)
- Historique de recherche avec chips cliquables et suppression animée
- État "Traduction en cours..." visible pendant `isTranslating`
