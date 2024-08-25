import React, { useState } from 'react';
import "./App.css";
import { motion } from 'framer-motion';
import styled from 'styled-components';
import SearchBar from './components/SearchBar';
import Definition from './components/Definition';
import { useTranslation } from 'react-i18next';
import './components/i18n.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  padding: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  color: #4a4e69;
  margin-bottom: 2rem;
`;

const LanguageSelector = styled.select`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 10px;
  background-color: #4a4e69;
  color: white;
  border: none;
  cursor: pointer;
  margin-left: 1rem;
`;
const LanguageSelectorWrapper = styled.div`
  position: relative;
  top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  right: 10rem;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 10px;
  color: white;
  border: none;
  cursor: pointer;
  margin: 1rem;
`
const Text = styled.label`
  font-size: 30px;
  color: #4a4e69;
  font-weight: 300;
`

const DefLanguageSelector = styled.select`
  position: relative;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 10px;
  background-color: #4a4e69;
  color: white;
  border: none;
  cursor: pointer;
  margin: 1rem;
`;

// const API_KEY = 'ae0d0877ee340765e496b38b592186eb46f0ce62';  // Replace with your API key

const App = () => {
  const [definitionData, setDefinitionData] = useState(null);
  const [translatedDefinition, setTranslatedDefinition] = useState(null);
  const [targetLang, setTargetLang] = useState('auto');
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const fetchDefinition = async (word) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setDefinitionData(data[0] || null);
      // handleTranslation(data[0].word, targetLang); // If needed
    } catch (error) {
      console.error("Erreur lors de la récupération des définitions", error);
      setDefinitionData(null);
      setTranslatedDefinition(null);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleTranslation = async (text, targetLang) => {
  //   try {
  //     let sourceLang = 'en';
  
  //     if (targetLang !== 'auto') {
  //       // Detect language only if not set to auto
  //       const detectResponse = await fetch('https://api.translateplus.io/v1/language_detect', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'X-API-KEY': API_KEY,
  //         },
  //         body: JSON.stringify({ text }),
  //       });
  //       const detectData = await detectResponse.json();
  //       sourceLang = detectData.language_detection.language || 'en';
  //     }
  
  //     // Translate
  //     const translateResponse = await fetch('https://api.translateplus.io/v1/translate', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-API-KEY': API_KEY,
  //       },
  //       body: JSON.stringify({ text, source: sourceLang, target: targetLang === 'auto' ? 'en' : targetLang }),
  //     });
  
  //     const translateData = await translateResponse.json();
  //     setTranslatedDefinition(translateData.translations.translation || '');
  //   } catch (error) {
  //     console.error("Erreur lors de la traduction", error);
  //     setTranslatedDefinition(null);
  //   }
  // };
  
  const handleTranslationLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setTargetLang(selectedLang);
  
    if (definitionData) {
      // Re-translate the existing word
      handleTranslation(definitionData.word, selectedLang);
    }
  };  

  // Fonction pour détecter la langue source
const detectLanguage = async (text) => {
  const detectHeaders = new Headers();
  detectHeaders.append("apikey", "GKOUb8f9fo055acAwUWsBA0QhhEsVZyn");

  const detectRequestOptions = {
    method: 'POST',
    redirect: 'follow',
    headers: detectHeaders,
    body: text
  };

  try {
    const detectResponse = await fetch("https://api.apilayer.com/language_translation/detect", detectRequestOptions);
    const detectData = await detectResponse.json();
    return detectData.language || 'en'; // Retourne la langue détectée ou "en" par défaut
  } catch (error) {
    console.error('Erreur lors de la détection de la langue', error);
    return 'en'; // En cas d'erreur, retourne "en" par défaut
  }
};

// Fonction pour traduire le texte
const translateText = async (text, targetLang = 'en') => {
  const sourceLang = await detectLanguage(text);

  const translateHeaders = new Headers();
  translateHeaders.append("apikey", "GKOUb8f9fo055acAwUWsBA0QhhEsVZyn");

  const raw = encodeURIComponent(text);

  const translateRequestOptions = {
    method: 'POST',
    redirect: 'follow',
    headers: translateHeaders,
    body: raw
  };

  try {
    const translateResponse = await fetch(`https://api.apilayer.com/language_translation/translate?target=${targetLang}&source=${sourceLang}`, translateRequestOptions);
    const translateData = await translateResponse.json();
    return translateData.translation || '';
  } catch (error) {
    console.error('Erreur lors de la traduction', error);
    return ''; // En cas d'erreur, retourne une chaîne vide
  }
};

// Exemple d'utilisation dans le flux existant
const handleTranslation = async (text, targetLang = 'en') => {
  try {
    const translatedText = await translateText(text, targetLang);
    setTranslatedDefinition(translatedText);
  } catch (error) {
    console.error('Erreur lors de la traduction', error);
    setTranslatedDefinition(null);
  }
};


  const handleUIChangeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <Container>
      <div>
        <LanguageSelector onChange={handleUIChangeLanguage} value={i18n.language}>
          <option value="fr">Français</option>
          <option value="en">English</option>
        </LanguageSelector>
      </div>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t('title')}
      </Title>

      <SearchBar onSearch={fetchDefinition} />
      <LanguageSelectorWrapper>
        <Text>
          {t('translateTo')}
        </Text>
        <DefLanguageSelector onChange={handleTranslationLanguageChange} value={targetLang}>
          <option value="auto">Auto detect</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="af">Afrikaans</option>
          <option value="ar">Arabic</option>
          <option value="zh-CN">Chinese (Simplified)</option>
          <option value="zh-TW">Chinese (Traditional)</option>
          <option value="nl">Dutch</option>
          <option value="de">German</option>
          <option value="el">Greek</option>
          <option value="ht">Haitian Creole</option>
          <option value="iw">Hebrew</option>
          <option value="ig">Igbo</option>
          <option value="it">Italian</option>
        </DefLanguageSelector>
      </LanguageSelectorWrapper>
      {definitionData && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Definition
            data={{
              word: definitionData.word || '',
              meanings: definitionData.meanings || [],
              translation: translatedDefinition || '',
            }}
          />
        </motion.div>
      )}
    </Container>
  );
};

export default App;
