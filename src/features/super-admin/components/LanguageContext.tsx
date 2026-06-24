import React, { createContext, useContext } from 'react';
import en from '../locales/en.json';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  flag: string;
}

// Single English language pack
export const LANGUAGES: Language[] = [
  { code: 'EN', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' }
];

interface LanguageContextType {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string, defaultVal?: string) => string;
  languages: Language[];
  currentLanguage: Language;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'EN',
  setLang: () => {},
  t: (key: string, defaultVal?: string) => defaultVal || key,
  languages: LANGUAGES,
  currentLanguage: LANGUAGES[0]
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const currentLanguage = LANGUAGES[0];

  const t = (key: string, defaultVal?: string): string => {
    if (!key) return '';
    const stringKey = key.trim();
    
    // Check exact key match
    if ((en as Record<string, string>)[stringKey] !== undefined) {
      return (en as Record<string, string>)[stringKey];
    }

    // Convert keys like "Total Customers" -> "total_customers" to match English json keys
    const snakeKey = stringKey.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    if ((en as Record<string, string>)[snakeKey] !== undefined) {
      return (en as Record<string, string>)[snakeKey];
    }

    // Default lookup: if it's already an English string corresponding to a value in en.json
    const lowKey = stringKey.toLowerCase();
    for (const [k, val] of Object.entries(en)) {
      if (val.toLowerCase().trim() === lowKey) {
        return val;
      }
    }

    return defaultVal !== undefined ? defaultVal : key;
  };

  return (
    <LanguageContext.Provider value={{ lang: 'EN', setLang: () => {}, t, languages: LANGUAGES, currentLanguage }}>
      <div className="ltr-content">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
