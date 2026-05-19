import { useState, useCallback } from 'react';

// Cache en mémoire — évite de refaire la même requête dans la session
const cache = new Map();

export const useDictionary = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDefinition = useCallback(async (word) => {
    const normalized = word.trim().toLowerCase();
    if (!normalized) return;

    // Retourne le cache si disponible
    if (cache.has(normalized)) {
      setData(cache.get(normalized));
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(normalized)}`
      );

      if (res.status === 404) {
        setError(`No definition found for "${word}".`);
        return;
      }
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const json = await res.json();
      const result = json[0] ?? null;

      cache.set(normalized, result);
      setData(result);
    } catch (e) {
      console.error('useDictionary error:', e);
      setError('An error occurred while fetching the definition.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, isLoading, error, fetchDefinition, clearData };
};