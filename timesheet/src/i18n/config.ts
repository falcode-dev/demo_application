import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ja: {
        translation: {
          welcome: 'ようこそ',
        },
      },
      en: {
        translation: {
          welcome: 'Welcome',
        },
      },
    },
    lng: 'ja',
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

