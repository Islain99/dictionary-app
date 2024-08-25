const fetch = require('node-fetch')

// const API_KEY = "GKOUb8f9fo055acAwUWsBA0QhhEsVZyn"
const API_KEY = "ae0d0877ee340765e496b38b592186eb46f0ce62"

const translate = async (req, res)=>{

    console.log('ENTERED SERVER SUCCESSFULLY')
    const { text, source, target } = req.body;
    console.log('Recieved data: ', text, source, target)

    try {
        console.log('processing ...')
      // Appel à l'API de traduction
      const translateResponse = await fetch('https://api.translateplus.io/v1/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_KEY,
        },
        body: JSON.stringify({
          text,
          source: source || 'en',
          target: target
        }),
      });
      console.log('processing completed')
      const translateData = await translateResponse.json();
      res.json(translateData)
  
    } catch (error) {
      console.error('Erreur lors de la traduction:', error);
      res.status(500).json({ error: 'Translation failed' });
    }
}

module.exports = {
    translate,
}