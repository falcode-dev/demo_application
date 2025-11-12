import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ja from "./locales/ja.json";
import en from "./locales/en.json";

/**
 * URLパラメータから言語を取得
 */
const getLanguageFromUrl = (): string | null => {
  try {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang") || params.get("language");
    if (lang === "ja" || lang === "en") {
      return lang;
    }
  } catch (e) {
    console.warn("Error getting language from URL:", e);
  }
  return null;
};

/**
 * Dataverseの言語ID → 言語コード変換
 * 1033: 英語, 1041: 日本語 など
 *
 * - モデル駆動型アプリの Web リソースでは Xrm は親フレーム(parent)に存在することが多い
 * - 別タブで開いた場合でも、親ウィンドウからXrmを取得できる可能性がある
 * - Utility.getGlobalContext() の呼び出し可否を安全に確認
 */
const getLanguageFromXrm = (): string | null => {
  try {
    // ✅ Xrmを安全に取得（複数の方法を試行）
    let xrm: any = null;

    // 1. 現在のウィンドウのXrm
    if ((window as any).Xrm) {
      xrm = (window as any).Xrm;
    }
    // 2. 親フレームのXrm（iframe内の場合）
    else if (window.parent && window.parent !== window) {
      try {
        if ((window.parent as any).Xrm) {
          xrm = (window.parent as any).Xrm;
        }
      } catch (e) {
        // クロスオリジンの場合は無視
      }
    }
    // 3. トップウィンドウのXrm（別タブで開いた場合でも、同じオリジンなら取得可能）
    else if (window.top && window.top !== window) {
      try {
        if ((window.top as any).Xrm) {
          xrm = (window.top as any).Xrm;
        }
      } catch (e) {
        // クロスオリジンの場合は無視
      }
    }

    if (!xrm) {
      return null;
    }

    // ✅ getGlobalContextが関数か確認
    if (typeof xrm.Utility?.getGlobalContext === "function") {
      const context = xrm.Utility.getGlobalContext();
      const langId = context.userSettings?.languageId;

      switch (langId) {
        case 1041:
          return "ja";
        case 1033:
          return "en";
        default:
          console.warn(`Unsupported languageId: ${langId}, fallback to English`);
          return "en";
      }
    }

    return null;
  } catch (e) {
    console.error("Error getting Xrm language context:", e);
    return null;
  }
};

/**
 * 言語を判定（優先順位: URLパラメータ > Xrm > ブラウザ言語）
 */
const detectLanguage = (): string => {
  // 1. URLパラメータから取得を試行
  const urlLang = getLanguageFromUrl();
  if (urlLang) {
    return urlLang;
  }

  // 2. Xrmから取得を試行
  const xrmLang = getLanguageFromXrm();
  if (xrmLang) {
    return xrmLang;
  }

  // 3. ブラウザの言語設定にフォールバック
  const browserLang = navigator.language.startsWith("ja") ? "ja" : "en";
  console.warn("Language detection: Using browser language as fallback:", browserLang);
  return browserLang;
};

/** Dataverse / ローカル環境両対応の言語判定 */
const userLang = detectLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: ja },
      en: { translation: en },
    },
    lng: userLang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

