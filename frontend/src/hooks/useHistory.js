import { useState, useCallback } from 'react';

const STORAGE_KEY = 'dictionary_search_history';
const MAX_ENTRIES = 20;

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (entries) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage peut être indisponible (navigation privée, quota dépassé)
    console.warn('Could not save history to localStorage.');
  }
};

export const useHistory = () => {
  const [history, setHistory] = useState(loadFromStorage);

  const addEntry = useCallback((word) => {
    if (!word?.trim()) return;
    const normalized = word.trim().toLowerCase();

    setHistory((prev) => {
      // Retire le doublon s'il existe déjà, puis ajoute en tête
      const filtered = prev.filter((w) => w !== normalized);
      const updated = [normalized, ...filtered].slice(0, MAX_ENTRIES);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const removeEntry = useCallback((word) => {
    setHistory((prev) => {
      const updated = prev.filter((w) => w !== word);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveToStorage([]);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
};