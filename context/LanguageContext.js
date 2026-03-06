"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale");
    if (savedLocale && (savedLocale === "en" || savedLocale === "zh")) {
      setLocale(savedLocale);
    } else {
      // Browser language detection (optional)
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "zh") {
        setLocale("zh");
      }
    }
  }, []);

  const setLanguage = (newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      localStorage.setItem("locale", newLocale);
    }
  };

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "zh" : "en";
    setLanguage(newLocale);
  };

  const t = (keyPath) => {
    const keys = keyPath.split(".");
    let value = translations[locale];

    for (const key of keys) {
      if (value[key] === undefined) {
        console.warn(`Translation key not found: ${keyPath}`);
        return keyPath;
      }
      value = value[key];
    }
    return value;
  };

  return (
    <LanguageContext.Provider
      value={{ locale, setLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
