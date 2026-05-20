import React, { useEffect, useState } from 'react';
import "./App.css";
import { motion } from 'framer-motion';
import styled from 'styled-components';
import SearchBar from './components/SearchBar';
import Definition from './components/Definition';
import SearchHistory from './components/SearchHistory';
import { useTranslation as useI18n } from '../node_modules/react-i18next';
import './components/i18n';
import { useDictionary } from './hooks/useDictionary';
import { useTranslation } from './hooks/useTranslation';
import { useHistory } from './hooks/useHistory';

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  top: 1.5rem;
  right: 1.5rem;

  padding: 0.7rem 1rem;
  padding-right: 2.5rem;

  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.3px;

  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);

  background: rgba(27, 25, 25, 0.42);
  backdrop-filter: blur(10px);

  color: #ffffff;

  cursor: pointer;
  outline: none;

  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;

  appearance: none;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 5.5l6 6 6-6' stroke='white' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");

  background-repeat: no-repeat;
  background-position: right 0.8rem center;

  &:hover {
    background-color: rgba(92, 96, 130, 0.95);
    transform: translateY(-2px);
    box-shadow:
      0 8px 20px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  &:focus {
    border-color: #9a8d8c;
    box-shadow:
      0 0 0 3px rgba(154, 140, 152, 0.35),
      0 8px 20px rgba(0, 0, 0, 0.2);
  }

  option {
    background: #22223b;
    color: white;
  }
`;

// const LanguageSelectorWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;

//   padding: 0.8rem 1rem;
//   margin: 1rem 0;

//   background: rgba(27, 25, 25, 0.17);
//   backdrop-filter: blur(12px);

//   border: 1px solid rgba(255, 255, 255, 0.08);
//   border-radius: 18px;

//   box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

//   width: fit-content;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     align-items: stretch;
//     width: 100%;
//   }
// `;

const Text = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #383634e3;
  letter-spacing: 0.3px;
`;

// const DefLanguageSelector = styled.select`
//   min-width: 240px;

//   padding: 0.8rem 1rem;
//   padding-right: 2.8rem;

//   font-size: 0.95rem;
//   font-weight: 500;

//   color: #383634e3;
//   background: linear-gradient(
//     135deg,
//     rgba(74, 78, 105, 0.95),
//     rgba(34, 34, 59, 0.95)
//   );

//   border: 1px solid rgba(255, 255, 255, 0.12);
//   border-radius: 14px;

//   outline: none;
//   cursor: pointer;

//   appearance: none;

//   transition:
//     all 0.25s ease,
//     transform 0.2s ease;

//   box-shadow:
//     0 4px 14px rgba(0, 0, 0, 0.15),
//     inset 0 1px 0 rgba(255, 255, 255, 0.05);

//   background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M2 5l6 6 6-6' stroke='white' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");

//   background-repeat: no-repeat;
//   background-position: right 1rem center;

//   &:hover {
//     transform: translateY(-2px);

//     border-color: rgba(255, 255, 255, 0.2);

//     box-shadow:
//       0 10px 22px rgba(0, 0, 0, 0.22),
//       inset 0 1px 0 rgba(255, 255, 255, 0.08);
//   }

//   &:focus {
//     border-color: #9a8c98;

//     box-shadow:
//       0 0 0 4px rgba(154, 140, 152, 0.3),
//       0 10px 22px rgba(0, 0, 0, 0.2);
//   }

//   option {
//     background: #22223b;
//     color: #ffffff;
//     padding: 0.5rem;
//   }

//   @media (max-width: 768px) {
//     width: 100%;
//     min-width: unset;
//   }
// `;

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

// ─── Composant ────────────────────────────────────────────────────────────────

const App = () => {
  const { t, i18n } = useI18n();
  const [targetLang, setTargetLang] = useState('auto');

  // Hooks métier
  const { data: definitionData, isLoading, error, fetchDefinition } = useDictionary();
  const { translated, isTranslating, translationError, translate, clearTranslation } = useTranslation();
  const { history, addEntry, removeEntry, clearHistory } = useHistory();

  // Re-traduit quand les données ou la langue changent
  useEffect(() => {
    if (!definitionData) {
      clearTranslation();
      return;
    }
    const text = definitionData.meanings
      .flatMap((m) => m.definitions.map((d) => d.definition))
      .join(' ');
    translate(text, targetLang);
  }, [definitionData, targetLang]);

  // Lance une recherche et enregistre dans l'historique
  const handleSearch = (word) => {
    fetchDefinition(word);
    addEntry(word);
  };

  // Sélectionne un mot depuis l'historique (remonte en tête)
  const handleHistorySelect = (word) => {
    fetchDefinition(word);
    addEntry(word);
  };

  return (
    <Container>
      <LanguageSelector
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        value={i18n.language}
      >
        <option value="fr">🇫🇷 Français</option>
        <option value="en">🇬🇧 English</option>
      </LanguageSelector>

      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t('title')}
      </Title>

      <SearchBar onSearch={handleSearch} />

      {/* Historique de recherche */}
      <SearchHistory
        history={history}
        onSelect={handleHistorySelect}
        onRemove={removeEntry}
        onClear={clearHistory}
      />

      {/* <LanguageSelectorWrapper>
        <Text>{t('translateTo')}</Text>
        <DefLanguageSelector
          onChange={(e) => setTargetLang(e.target.value)}
          value={targetLang}
        >
          <option value="auto">— {t('selectLanguage')} —</option>
          <option value="en">🇬🇧 English</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="af">🇿🇦 Afrikaans</option>
          <option value="ar">🇸🇦 Arabic</option>
          <option value="zh-CN">🇨🇳 Chinese (Simplified)</option>
          <option value="zh-TW">🇹🇼 Chinese (Traditional)</option>
          <option value="nl">🇳🇱 Dutch</option>
          <option value="de">🇩🇪 German</option>
          <option value="el">🇬🇷 Greek</option>
          <option value="ht">🇭🇹 Haitian Creole</option>
          <option value="iw">🇮🇱 Hebrew</option>
          <option value="ig">🇳🇬 Igbo</option>
          <option value="it">🇮🇹 Italian</option>
        </DefLanguageSelector>
      </LanguageSelectorWrapper> */}

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
              phonetic: definitionData.phonetic || '',
              phonetics: definitionData.phonetics || [],
              meanings: definitionData.meanings || [],
              translation: translated || '',
              isTranslating,
              translationError,
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