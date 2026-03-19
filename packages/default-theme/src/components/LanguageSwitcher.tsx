import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../hooks';

export interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'dropdown' | 'buttons' | 'flags';
}

const languageFlags: Record<string, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  pt: '🇧🇷',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ko: '🇰🇷',
  it: '🇮🇹',
  ru: '🇷🇺',
  ar: '🇸🇦',
  hi: '🇮🇳',
};

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  it: 'Italiano',
  ru: 'Русский',
  ar: 'العربية',
  hi: 'हिन्दी',
};

export function LanguageSwitcher({
  className = '',
  showLabel = true,
  variant = 'dropdown',
}: LanguageSwitcherProps) {
  const { currentLanguage, availableLanguages, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-1 ${className}`}>
        {availableLanguages.map((lang: string) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              currentLanguage === lang
                ? 'bg-[rgb(var(--color-primary-500))] text-white'
                : 'bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--border-color))]'
            }`}
          >
            {languageFlags[lang]} {showLabel && languageNames[lang]}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'flags') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {availableLanguages.map((lang: string) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`text-2xl transition-transform ${
              currentLanguage === lang ? 'scale-110' : 'opacity-50 hover:opacity-75'
            }`}
            title={languageNames[lang]}
          >
            {languageFlags[lang]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgb(var(--bg-tertiary))] hover:bg-[rgb(var(--border-color))] transition-colors"
      >
        <span className="text-xl">{languageFlags[currentLanguage]}</span>
        {showLabel && (
          <>
            <span className="text-sm font-medium">{languageNames[currentLanguage]}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-color))] rounded-lg shadow-lg z-50 overflow-hidden">
          {availableLanguages.map((lang: string) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[rgb(var(--bg-tertiary))] transition-colors ${
                currentLanguage === lang
                  ? 'bg-[rgb(var(--color-primary-50))] dark:bg-[rgb(var(--color-primary-900))]/30'
                  : ''
              }`}
            >
              <span className="text-xl">{languageFlags[lang]}</span>
              <span className="text-sm font-medium">{languageNames[lang]}</span>
              {currentLanguage === lang && (
                <svg
                  className="w-4 h-4 ml-auto text-[rgb(var(--color-primary-500))]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
