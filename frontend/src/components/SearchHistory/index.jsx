import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// ─── Styles ───────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 1rem auto 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.6rem;
`;

const Label = styled.span`
  font-size: 0.85rem;
  color: #9a8c98;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  font-size: 0.85rem;
  color: #9a8c98;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #c0392b;
  }
`;

const ChipList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Chip = styled(motion.li)`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: #f0eef8;
  border: 1px solid #c3b8e8;
  border-radius: 999px;
  padding: 0.3rem 0.75rem;
  font-size: 0.9rem;
  color: #4a4e69;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  user-select: none;

  &:hover {
    background: #e2ddf5;
    border-color: #9a8c98;
  }
`;

const ChipWord = styled.span`
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  line-height: 1;
  font-size: 0.85rem;
  color: #9a8c98;
  cursor: pointer;
  transition: color 0.2s;
  flex-shrink: 0;

  &:hover {
    color: #c0392b;
  }
`;

// ─── Composant ────────────────────────────────────────────────────────────────

const SearchHistory = ({ history, onSelect, onRemove, onClear }) => {
  const { t } = useTranslation();

  if (!history || history.length === 0) return null;

  return (
    <Wrapper>
      <Header>
        <Label>{t('recentSearches')}</Label>
        <ClearButton onClick={onClear} aria-label={t('clearHistory')}>
          {t('clearAll')}
        </ClearButton>
      </Header>

      <ChipList>
        <AnimatePresence initial={false}>
          {history.map((word) => (
            <Chip
              key={word}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
              layout
            >
              <ChipWord
                onClick={() => onSelect(word)}
                title={word}
              >
                {word}
              </ChipWord>
              <RemoveBtn
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(word);
                }}
                aria-label={`${t('removeEntry')} ${word}`}
              >
                ✕
              </RemoveBtn>
            </Chip>
          ))}
        </AnimatePresence>
      </ChipList>
    </Wrapper>
  );
};

export default SearchHistory;