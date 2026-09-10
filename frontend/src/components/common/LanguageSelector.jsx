import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'bn', label: 'বাংলা' },
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
];

export function LanguageSelector({ compact = false }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav aria-label="Language selection" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <div
        role="group"
        aria-label="Select website language"
        style={{
          display: 'inline-flex',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '2px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        {LANGUAGES.map((lang) => {
          const isActive = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => changeLanguage(lang.code)}
              aria-pressed={isActive}
              aria-label={`Change language to ${lang.label}`}
              style={{
                background: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#8b0000' : '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: compact ? '3px 8px' : '4px 10px',
                fontSize: compact ? '12px' : '13px',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease, color 0.15s ease',
              }}
            >
              {lang.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default LanguageSelector;