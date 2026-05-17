import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

// En prod Vercel : VITE_BACKEND_URL est vide, on utilise /api (meme domaine)
// En dev local  : VITE_BACKEND_URL=http://localhost:5000
const BASE = import.meta.env.VITE_BACKEND_URL || '';
const DEBOUNCE_MS = 400;

const translationCache = new Map();

export const useTranslation = () => {
  const [translated, setTranslated] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(null);
  const debounceRef = useRef(null);

  const translate = useCallback((text, targetLang) => {
    if (!text?.trim() || !targetLang || targetLang === 'auto') {
      setTranslated(null);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const cacheKey = `${text.trim()}__${targetLang}`;

      if (translationCache.has(cacheKey)) {
        setTranslated(translationCache.get(cacheKey));
        return;
      }

      setIsTranslating(true);
      setTranslationError(null);

      try {
        const { data } = await axios.post(
          `${BASE}/api/translate`,
          { text: text.trim(), target: targetLang },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const result = data.translated_text ?? null;
        translationCache.set(cacheKey, result);
        setTranslated(result);
      } catch (e) {
        console.error('useTranslation error:', e);
        setTranslationError('Translation failed. Please try again.');
        setTranslated(null);
      } finally {
        setIsTranslating(false);
      }
    }, DEBOUNCE_MS);
  }, []);

  const clearTranslation = useCallback(() => {
    clearTimeout(debounceRef.current);
    setTranslated(null);
    setTranslationError(null);
  }, []);

  return { translated, isTranslating, translationError, translate, clearTranslation };
};