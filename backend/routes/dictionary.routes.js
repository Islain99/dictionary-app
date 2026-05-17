const express = require('express');
const router = express.Router();
const { translate, detectLanguage } = require('../controllers/dictionary.controllers');

// Traduction d'un texte vers une langue cible
router.post('/language_translation/translate', translate);

// Détection de langue — remplace l'appel direct depuis le frontend
router.post('/language_translation/detect', detectLanguage);

module.exports = router;