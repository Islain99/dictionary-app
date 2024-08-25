const express = require('express');
const router = express.Router();
const dictionaryApi = require('./dictionary.routes')

router.post('/', (req, res)=>{
        console.log('Received POST request');
        res.json("Hello What do you want")
    });

router.post('/api', dictionaryApi)

module.exports = router;