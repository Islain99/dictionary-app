import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// ─── Styles ───────────────────────────────────────────────────────────────────

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Input = styled.input`
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  border: 2px solid #4a4e69;
  border-radius: 25px;
  outline: none;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out;
  flex: 1;

  &:focus {
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
    border-color: #9a8c98;
  }
`;

const Button = styled(motion.button)`
  padding: 0.5rem 1.5rem;
  font-size: 1.2rem;
  background-color: #4a4e69;
  color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  margin-left: 1rem;
  white-space: nowrap;

  &:hover {
    background-color: #9a8c98;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ─── Composant ────────────────────────────────────────────────────────────────

const SearchBar = ({ onSearch }) => {
  const [word, setWord] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = word.trim();

    // Bug corrigé : on ne lance pas la recherche si le champ est vide
    if (!trimmed) return;

    onSearch(trimmed);

    // Bug corrigé : le champ est vidé après la recherche
    // (était commenté dans la version originale)
    setWord('');
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <InputContainer>
        <Input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchPlaceholder')}
          autoComplete="off"
          spellCheck="false"
        />
        <Button
          type="submit"
          whileHover={{ scale: 1.05 }}
          aria-label={t('searchButton')}
          disabled={!word.trim()}
        >
          {t('searchButton')}
        </Button>
      </InputContainer>
    </Form>
  );
};

export default SearchBar;