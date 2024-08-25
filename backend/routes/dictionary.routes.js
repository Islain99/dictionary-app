const express = require('express');
const router = express.Router();
const {translate} = require('../controllers/dictionary.controllers')

router.post('/language_translation/translate', translate)

module.exports = router