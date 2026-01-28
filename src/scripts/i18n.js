import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../locales/en.json';
import es from '../locales/es.json';

const initI18n = () => {
  i18next
    .use(LanguageDetector)
    .init({
      resources: {
        en: { translation: en },
        es: { translation: es }
      },
      fallbackLng: 'en',
      detection: {
        order: ['querystring', 'localStorage', 'navigator'],
        lookupQuerystring: 'lang',
        lookupLocalStorage: 'i18nextLng',
        caches: ['localStorage']
      }
    })
    .then(() => {
      updateContent();
      updateLanguageToggle();
    });
};

const updateContent = () => {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    element.textContent = i18next.t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = i18next.t(key);
  });
};

const updateLanguageToggle = () => {
  const toggle = document.getElementById('lang-toggle');
  if (toggle) {
    toggle.textContent = i18next.language === 'es' ? 'EN' : 'ES';
  }
};

const toggleLanguage = () => {
  const newLang = i18next.language === 'es' ? 'en' : 'es';
  i18next.changeLanguage(newLang).then(() => {
    updateContent();
    updateLanguageToggle();
  });
};

// Expose toggle function globally
window.toggleLanguage = toggleLanguage;

export default initI18n;
