import React, { useState } from 'react';
import "./App.css";
import { motion } from 'framer-motion';
import styled from 'styled-components';
import SearchBar from './components/SearchBar';
import Definition from './components/Definition';
import { useTranslation } from 'react-i18next';
import axios from 'axios'
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
`;

const Text = styled.label`
  font-size: 30px;
  color: #4a4e69;
  font-weight: 300;
`;

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

const ErrorMessage = styled.p`
  color: red;
  font-size: 1.2rem;
  margin-top: 1rem;
`;

const LoadingMessage = styled.p`
  color: #4a4e69;
  font-size: 1.2rem;
  margin-top: 1rem;
`;

const App = () => {
  const [definitionData, setDefinitionData] = useState(null);
  const [translatedDefinition, setTranslatedDefinition] = useState(null);
  const [targetLang, setTargetLang] = useState('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  const fetchDefinition = async (word) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      
      if (response.status === 404) {
        setError(`No definition found for "${word}".`);
        setDefinitionData(null);
        setTranslatedDefinition(null);
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch the definition');
      
      const data = await response.json();
      setDefinitionData(data[0] || null);
      
      // Handle translation if needed
      await handleTranslation(data[0]?.meanings.map(meaning => meaning.definitions.map(def => def.definition).join(' ')).join(' '), targetLang);
    } catch (error) {
      console.error("Erreur lors de la récupération des définitions", error);
      setError('An error occurred while fetching the definition.');
      setDefinitionData(null);
      setTranslatedDefinition(null);
    } finally {
      setIsLoading(false);
    }
  };

  const API_KEY = "GKOUb8f9fo055acAwUWsBA0QhhEsVZyn";

  const detectLanguage = async (text) => {
    try {
      const response = await fetch("https://api.apilayer.com/language_translation/identify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": API_KEY 
        },
        redirect: 'follow',
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) throw new Error('Language detection failed');
      
      const data = await response.json();
      const languagesArray = data.languages;
  
      if (languagesArray && languagesArray.length > 0) {
        const firstDetectedLanguage = languagesArray[0].language;
        return firstDetectedLanguage;
      } else {
        return null; // Return null if no language detected
      }
    } catch (error) {
      console.error("Error detecting language:", error);
      return null; // Return null if there's an error
    }
  };

  const translateText = async (text, targetLang) => {
    try {
      const sourceLang = await detectLanguage(text);
      if (!sourceLang) {
        console.error("Source language detection failed");
        return null; // Handle the case where language detection fails
      }

      console.log('Targeted language: ', targetLang, '\nText: ', text, '\nSource: ', sourceLang);
  
      const response = await axios.post('http://localhost:5000/api/language_translation/translate/', {
        text: text,
        source: sourceLang,
        target: targetLang
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status !== 200) {
        if (response.status === 404) throw new Error('Translation endpoint not found');
        throw new Error('Translation failed');
      }
  
      const data = response.data;
      return data.translated_text;
    } catch (error) {
      console.error("Error translating text:", error);
      return null; // Handle errors and return null
    }
  };

  const handleTranslation = async (text, targetLang) => {
    if (!text) return;
    try {
      const translatedText = await translateText(text, targetLang);
      setTranslatedDefinition(translatedText);
    } catch (error) {
      console.error('Erreur lors de la traduction', error);
      setError('An error occurred while translating the text.');
      setTranslatedDefinition(null);
    }
  };

  const handleTranslationLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setTargetLang(selectedLang);

    if (definitionData) {
      // Re-translate the existing word
      const definitionsText = definitionData.meanings.map(meaning => meaning.definitions.map(def => def.definition).join(' ')).join(' ');
      handleTranslation(definitionsText, selectedLang);
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
      {isLoading ? (
        <LoadingMessage>{t('loading')}</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : definitionData ? (
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
      ) : (
        <p>{t('noResults')}</p>
      )}
    </Container>
  );
};

export default App;
