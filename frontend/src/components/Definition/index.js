import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

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

const WordTitle = styled.h3`
  font-size: 2rem;
  color: #4a4e69;
  margin-bottom: 1rem;
`;

const PartOfSpeech = styled.h4`
  font-size: 1.2rem;
  color: #9a8c98;
  margin-top: 1rem;
`;

const DefinitionItem = styled.li`
  margin-bottom: 0.5rem;
`;

const Example = styled.p`
  font-style: italic;
  color: #7d7d7d;
  margin-top: 0.5rem;
`;

const Synonyms = styled.p`
  font-weight: bold;
  color: #4a4e69;
  margin-top: 0.5rem;
`;

const Definition = ({ data }) => {
  const { t } = useTranslation();

  if (!data) {
    return <div>{t('noDefinition')}</div>;
  }

  return (
    <DefinitionContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <WordTitle>{data.word}</WordTitle>
      {data.meanings.map((meaning, index) => (
        <div key={index}>
          <PartOfSpeech>{meaning.partOfSpeech}</PartOfSpeech>
          <ul>
            {meaning.definitions.map((def, i) => (
              <DefinitionItem key={i}>
                {def.definition}
                {def.example && <Example>{`"${def.example}"`}</Example>}
              </DefinitionItem>
            ))}
          </ul>
          {meaning.synonyms && meaning.synonyms.length > 0 && (
            <Synonyms>{`${t('synonyms')}: ${meaning.synonyms.join(', ')}`}</Synonyms>
          )}
        </div>
      ))}
    </DefinitionContainer>
  );
};

export default Definition;
