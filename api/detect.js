const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // CORS
  const origin = req.headers.origin || '';
  const allowed = process.env.FRONTEND_URL || '';
  if (allowed && origin !== allowed) {
    return res.status(403).json({ error: 'Origine non autorisée.' });
  }

  res.setHeader('Access-Control-Allow-Origin', allowed || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Le champ "text" est requis.' });
  }

  const API_KEY = process.env.TRANSLATE_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'Configuration serveur manquante.' });
  }

  try {
    const response = await fetch('https://api.apilayer.com/language_translation/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': API_KEY },
      body: JSON.stringify({ text: text.trim() }),
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Erreur du service de détection.' });
    }

    const data = await response.json();
    const detected = data.languages?.[0]?.language ?? null;
    return res.status(200).json({ language: detected });

  } catch (err) {
    console.error('detect error:', err.message);
    return res.status(500).json({ error: 'Erreur interne lors de la détection.' });
  }
};