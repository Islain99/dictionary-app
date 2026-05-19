import i18n from 'i18next';
import { initReactI18next } from '../../node_modules/react-i18next';

const resources = {
  en: {
    translation: {
      title: "Dictionary App",
      searchPlaceholder: "Search a word...",
      searchButton: "Search",
      noDefinition: "No definition found.",
      translateTo: "Translate to:",
      selectLanguage: "Select a language",
      noResults: "Search for a word to get started.",
      loading: "Loading...",
      synonyms: "Synonyms",
      translation: "Translation",
      translating: "Translating...",
      playAudio: "Listen to pronunciation",
      stopAudio: "Stop audio",
      noAudio: "No audio available",
      recentSearches: "Recent searches",
      clearAll: "Clear all",
      clearHistory: "Clear search history",
      removeEntry: "Remove",
    }
  },
  fr: {
    translation: {
      title: "Application de Dictionnaire",
      searchPlaceholder: "Chercher un mot...",
      searchButton: "Rechercher",
      noDefinition: "Aucune définition trouvée.",
      translateTo: "Traduire en :",
      selectLanguage: "Choisir une langue",
      noResults: "Recherchez un mot pour commencer.",
      loading: "Chargement...",
      synonyms: "Synonymes",
      translation: "Traduction",
      translating: "Traduction en cours...",
      playAudio: "Écouter la prononciation",
      stopAudio: "Arrêter l'audio",
      noAudio: "Aucun audio disponible",
      recentSearches: "Recherches récentes",
      clearAll: "Tout effacer",
      clearHistory: "Effacer l'historique",
      removeEntry: "Supprimer",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;