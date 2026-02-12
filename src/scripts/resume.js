import i18next from 'i18next';
import en from '../locales/en.json';
import es from '../locales/es.json';

const savedLang = localStorage.getItem('i18nextLng') || 'en';

i18next
  .init({
    lng: savedLang,
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: 'en',
  })
  .then(() => {
    updateContent();
    updateToggle();
  });

function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const val = i18next.t(key);
    if (val && val !== key) {
      el.textContent = val;
    }
  });
}

function updateToggle() {
  const toggle = document.getElementById('lang-toggle');
  if (toggle) {
    toggle.textContent = i18next.language === 'es' ? 'EN' : 'ES';
  }
}

function toggleLanguage() {
  const newLang = i18next.language === 'es' ? 'en' : 'es';
  i18next.changeLanguage(newLang).then(() => {
    localStorage.setItem('i18nextLng', newLang);
    updateContent();
    updateToggle();
  });
}

// Attach event listeners (replaces inline onclick handlers)
document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);
document.getElementById('save-pdf-btn').addEventListener('click', () => window.print());
