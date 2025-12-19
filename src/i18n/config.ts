import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation files
import en from "./locales/en.json";
import es from "./locales/es.json";

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: (() => {
    try {
      return localStorage.getItem("language") || "en";
    } catch {
      return "en";
    }
  })(), // Default to English
  fallbackLng: "en",

  interpolation: {
    escapeValue: false, // React already does escaping
  },
});

export default i18n;
