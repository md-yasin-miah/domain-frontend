import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

const apiBase = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${apiBase}/i18n/translations/{{lng}}`,
    },
    lng: (() => {
      try {
        return localStorage.getItem("language") || "en";
      } catch {
        return "en";
      }
    })(),
    fallbackLng: "en",

    detection: {
      order: [],
      caches: [],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
