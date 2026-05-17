const fetch = require('node-fetch');

const getApiKey = () => {
  const key = process.env.TRANSLATE_API_KEY;
  if (!key) throw new Error('TRANSLATE_API_KEY manquante dans .env');
  return key;
};

// ─── Validation ───────────────────────────────────────────────────────────────

const SUPPORTED_TARGETS = new Set([
  'en', 'fr', 'af', 'ar', 'zh-CN', 'zh-TW',
  'nl', 'de', 'el', 'ht', 'iw', 'ig', 'it',
  'es', 'pt', 'ru', 'ja', 'ko', 'pl', 'sv',
]);

const validateTranslateInput = ({ text, target }) => {
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

// ─── Détection de langue (appelée côté backend uniquement) ───────────────────

const detectLanguage = async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Le champ "text" est requis.' });
  }

  try {
    const API_KEY = getApiKey();
    const response = await fetch('https://api.apilayer.com/language_translation/identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY,
      },
      body: JSON.stringify({ text: text.trim() }),
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Erreur du service de détection de langue.' });
    }

    const data = await response.json();
    const detected = data.languages?.[0]?.language ?? null;
    res.json({ language: detected });

  } catch (error) {
    console.error('detectLanguage error:', error.message);
    res.status(500).json({ error: 'Erreur interne lors de la détection de langue.' });
  }
};

// ─── Traduction ───────────────────────────────────────────────────────────────

const translate = async (req, res) => {
  const validationError = validateTranslateInput(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const { text, target } = req.body;

  try {
    const API_KEY = getApiKey();

    // Détecte la langue source automatiquement via l'API
    const detectRes = await fetch('https://api.apilayer.com/language_translation/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': API_KEY },
      body: JSON.stringify({ text: text.trim() }),
    });
    const detectData = await detectRes.json();
    const sourceLang = detectData.languages?.[0]?.language || 'en';

    // Traduit
    const translateResponse = await fetch('https://api.translateplus.io/v1/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
      },
      body: JSON.stringify({
        text: text.trim(),
        source: sourceLang,
        target,
      }),
    });

    if (!translateResponse.ok) {
      return res.status(502).json({ error: 'Erreur du service de traduction.' });
    }

    const translateData = await translateResponse.json();
    res.json(translateData);

  } catch (error) {
    console.error('translate error:', error.message);
    res.status(500).json({ error: 'Erreur interne lors de la traduction.' });
  }
};

module.exports = { translate, detectLanguage };