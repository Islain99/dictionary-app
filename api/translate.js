const fetch = require('node-fetch');

const SUPPORTED_TARGETS = new Set([
  'en', 'fr', 'af', 'ar', 'zh-CN', 'zh-TW',
  'nl', 'de', 'el', 'ht', 'iw', 'ig', 'it',
  'es', 'pt', 'ru', 'ja', 'ko', 'pl', 'sv',
]);

const validateInput = ({ text, target }) => {
  if (!text || typeof text !== 'string' || text.trim().length === 0)
    return 'Le champ "text" est requis et ne peut pas être vide.';
  if (text.length > 5000)
    return 'Le texte ne peut pas dépasser 5000 caractères.';
  if (!target || target === 'auto')
    return 'Une langue cible valide est requise.';
  if (!SUPPORTED_TARGETS.has(target))
    return `Langue cible non supportée : "${target}".`;
  return null;
};

module.exports = async (req, res) => {
  // CORS — autorise uniquement votre domaine Vercel
  const origin = req.headers.origin || '';
  const allowed = process.env.FRONTEND_URL || '';
  if (allowed && origin !== allowed) {
    return res.status(403).json({ error: 'Origine non autorisée.' });
  }

  // Preflight OPTIONS
  res.setHeader('Access-Control-Allow-Origin', allowed || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const validationError = validateInput(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const { text, target } = req.body;
  const API_KEY = process.env.TRANSLATE_API_KEY;

  if (!API_KEY) {
    console.error('TRANSLATE_API_KEY manquante');
    return res.status(500).json({ error: 'Configuration serveur manquante.' });
  }

  try {
    // Détection de la langue source
    const detectRes = await fetch('https://api.apilayer.com/language_translation/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': API_KEY },
      body: JSON.stringify({ text: text.trim() }),
    });
    const detectData = await detectRes.json();
    const sourceLang = detectData.languages?.[0]?.language || 'en';

    // Traduction
    const translateRes = await fetch('https://api.translateplus.io/v1/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
      },
      body: JSON.stringify({ text: text.trim(), source: sourceLang, target }),
    });

    if (!translateRes.ok) {
      return res.status(502).json({ error: 'Erreur du service de traduction.' });
    }

    const data = await translateRes.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error('translate error:', err.message);
    return res.status(500).json({ error: 'Erreur interne lors de la traduction.' });
  }
};