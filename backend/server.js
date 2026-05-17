require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const dictionaryApi = require('./routes/dictionary.routes');

const server = express();
const port = process.env.PORT || 5000;

// Heroku : les requetes passent par un proxy
// Necessaire pour que express-rate-limit lise la bonne IP
server.set('trust proxy', 1);

// CORS : autorise le frontend local en dev ET l'URL Vercel en production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

// Rate limiting global : 200 req / 15 min par IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requetes. Reessayez dans quelques minutes.' },
});

// Rate limiting strict sur les routes de traduction (API payante)
const translateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Limite de traduction atteinte. Reessayez dans une minute.' },
});

// Middleware
server.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS bloque pour l origine : ' + origin));
    }
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
server.use(bodyParser.json({ limit: '10kb' }));
server.use(globalLimiter);

// Routes
server.use('/api', translateLimiter, dictionaryApi);

// Healthcheck pour Heroku
server.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Gestion d'erreurs
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur interne est survenue.' });
});

server.listen(port, () => {
  console.log('Serveur demarre sur le port ' + port);
});