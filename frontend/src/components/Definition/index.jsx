import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAudio } from '../../hooks/useAudio';

// ─── Styles ───────────────────────────────────────────────────────────────────

const DefinitionContainer = styled(motion.div)`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
  width: 100%;
  max-width: 800px;
  text-align: left;
  overflow: hidden;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const WordHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`;

const WordTitle = styled.h3`
  font-size: 2rem;
  color: #4a4e69;
  margin: 0;
`;

const Phonetic = styled.span`
  font-size: 1.1rem;
  color: #9a8c98;
  font-style: italic;
`;

// Animation de pulsation pendant la lecture
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.15); }
`;

const AudioButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  border: 2px solid #4a4e69;
  background: ${({ $isPlaying }) => ($isPlaying ? '#4a4e69' : 'transparent')};
  color: ${({ $isPlaying }) => ($isPlaying ? '#fff' : '#4a4e69')};
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  animation: ${({ $isPlaying }) => ($isPlaying ? pulse : 'none')} 0.8s ease-in-out infinite;
  flex-shrink: 0;

  &:hover {
    background: #4a4e69;
    color: #fff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    animation: none;
  }
`;

const AudioError = styled.p`
  color: #c0392b;
  font-size: 0.85rem;
  margin: 0.25rem 0 0;
`;

const PartOfSpeech = styled.h4`
  font-size: 1.2rem;
  color: #9a8c98;
  margin-top: 1rem;
  margin-bottom: 0.25rem;
`;

const DefinitionItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

const Example = styled.p`
  font-style: italic;
  color: #7d7d7d;
  margin-top: 0.4rem;
`;

const Synonyms = styled.p`
  font-weight: bold;
  color: #4a4e69;
  margin-top: 0.5rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e8e8e8;
  margin: 1rem 0;
`;

const TranslationBox = styled.div`
  margin-top: 1.25rem;
  padding: 0.9rem 1rem;
  background: #f5f7fa;
  border-left: 3px solid #4a4e69;
  border-radius: 0 8px 8px 0;
`;

const TranslationLabel = styled.p`
  font-size: 0.8rem;
  color: #9a8c98;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.3rem;
`;

const TranslationText = styled.p`
  font-size: 1rem;
  color: #4a4e69;
  margin: 0;
  line-height: 1.5;
`;

const TranslationError = styled.p`
  font-size: 0.9rem;
  color: #c0392b;
  margin: 0;
`;

// ─── Utilitaire : trouve la meilleure URL audio dans phonetics ───────────────

const getBestAudioUrl = (phonetics = []) => {
  // Préfère les URLs qui commencent par https
  const withAudio = phonetics.filter(p => p.audio && p.audio.trim() !== '');
  const secure = withAudio.find(p => p.audio.startsWith('https'));
  return (secure || withAudio[0])?.audio ?? null;
};

// ─── Composant ────────────────────────────────────────────────────────────────

const Definition = ({ data }) => {
  const { t } = useTranslation();
  const { isPlaying, audioError, play, stop } = useAudio();

  if (!data) return <div>{t('noDefinition')}</div>;

  const audioUrl = getBestAudioUrl(data.phonetics);

  const handleAudioClick = () => {
    if (isPlaying) {
      stop();
    } else {
      play(audioUrl);
    }
  };

  return (
    <DefinitionContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* En-tête : mot + phonétique + bouton audio */}
      <WordHeader>
        <WordTitle>{data.word}</WordTitle>
        {data.phonetic && <Phonetic>{data.phonetic}</Phonetic>}
        <AudioButton
          onClick={handleAudioClick}
          $isPlaying={isPlaying}
          disabled={!audioUrl}
          aria-label={isPlaying ? t('stopAudio') : t('playAudio')}
          title={audioUrl ? (isPlaying ? t('stopAudio') : t('playAudio')) : t('noAudio')}
        >
          {isPlaying ? '■' : '▶'}
        </AudioButton>
      </WordHeader>

      {audioError && <AudioError>{audioError}</AudioError>}

      <Divider />

      {/* Définitions par partie du discours */}
      {data.meanings.map((meaning, index) => (
        <div key={index}>
          <PartOfSpeech>{meaning.partOfSpeech}</PartOfSpeech>
          <ul>
            {meaning.definitions.map((def, i) => (
              <DefinitionItem key={i}>
                {def.definition}
                {def.example && <Example>"{def.example}"</Example>}
              </DefinitionItem>
            ))}
          </ul>
          {meaning.synonyms?.length > 0 && (
            <Synonyms>
              {t('synonyms')}: {meaning.synonyms.slice(0, 8).join(', ')}
            </Synonyms>
          )}
        </div>
      ))}

      {/* Bloc de traduction */}
      {(data.translation || data.isTranslating || data.translationError) && (
        <>
          <Divider />
          <TranslationBox>
            <TranslationLabel>{t('translation')}</TranslationLabel>
            {data.isTranslating ? (
              <TranslationText>{t('translating')}</TranslationText>
            ) : data.translationError ? (
              <TranslationError>{data.translationError}</TranslationError>
            ) : (
              <TranslationText>{data.translation}</TranslationText>
            )}
          </TranslationBox>
        </>
      )}
    </DefinitionContainer>
  );
};

export default Definition;