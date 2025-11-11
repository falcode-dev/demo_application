import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ja from './locales/ja.json';
import en from './locales/en.json';

/**
 * Dataverseの言語ID → 言語コード変換
 * 1033: 英語, 1041: 日本語 など
 * 
 * - モデル駆動型アプリの Web リソースでは Xrm は親フレーム(parent)に存在することが多い
 * - Utility.getGlobalContext() の呼び出し可否を安全に確認
 */
const getLanguageFromXrm = (): string => {
  try {
    const xrm =
      (window as any).parent?.Xrm ||
      (window as any).Xrm ||
      null;

    if (!xrm) {
      console.warn('Xrm not found — fallback to browser language');
      return navigator.language.startsWith('ja') ? 'ja' : 'en';
    }

    if (typeof xrm.Utility?.getGlobalContext === 'function') {
      const context = xrm.Utility.getGlobalContext();
      const langId = context.userSettings?.languageId;

      switch (langId) {
        case 1041:
          return 'ja';
        case 1033:
          return 'en';
        default:
          console.warn(`Unsupported languageId: ${langId}, fallback to English`);
          return 'en';
      }
    }

    console.warn('getGlobalContext is not available — fallback to browser language');
    return navigator.language.startsWith('ja') ? 'ja' : 'en';
  } catch (e) {
    console.error('Error getting Xrm language context:', e);
    return navigator.language.startsWith('ja') ? 'ja' : 'en';
  }
};

const userLang = getLanguageFromXrm();
// const userLang = 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ja: {
        translation: ja,
      },
      en: {
        translation: en,
      },
    },
    lng: userLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

