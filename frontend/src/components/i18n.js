import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: "Dictionary App",
      searchPlaceholder: "Search a word...",
      searchButton: "Search",
      noDefinition: "No definition found.",
      translateTo: "Tranlate to:",
      noResults: "No result",
    }
  },
  fr: {
    translation: {
      title: "Application de Dictionnaire",
      searchPlaceholder: "Chercher un mot...",
      searchButton: "Rechercher",
      noDefinition: "Aucune définition trouvée.",
      translateTo: "Traduire en:",
      noResults: "Aucun résultat",
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
