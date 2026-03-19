import { useState, useEffect, useCallback } from 'react';
// @ts-ignore - This will be resolved at runtime
import { initializeI18n } from '@learnmd/core';

let i18nInstance: ReturnType<typeof initializeI18n> | null = null;

function getI18n() {
  if (!i18nInstance) {
    i18nInstance = initializeI18n();
  }
  return i18nInstance;
}

export function useI18n() {
  const i18n = getI18n();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.currentLanguage);
  const [availableLanguages] = useState(i18n.availableLanguages);

  useEffect(() => {
    const unsubscribe = i18n.onLanguageChange((lang: string) => {
      setCurrentLanguage(lang);
    });
    return unsubscribe;
  }, []);

  const setLanguage = useCallback((lang: string) => {
    i18n.setLanguage(lang);
    setCurrentLanguage(lang);
  }, []);

  const translate = useCallback(
    (key: string) => {
      return i18n.translate(key);
    },
    [currentLanguage]
  );

  const t = translate;

  return {
    currentLanguage,
    availableLanguages,
    setLanguage,
    t,
    translate,
    i18n,
  };
}

export { getI18n as i18nInstance };
