import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import './i18n/config';
import { PartsSearch } from './pages/PartsSearch';
import { PartsDetail } from './pages/PartsDetail';
import { useUrlParams } from './hooks/useUrlParams';

function App() {
  const partsNumber = useUrlParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    /**
     * URLパラメータから言語を取得して更新（最優先）
     * Power Appsから別タブで開く際は、?lang=ja または ?lang=en を渡す
     */
    const updateLanguageFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang') || params.get('language');
        if (urlLang === 'ja' || urlLang === 'en') {
          i18n.changeLanguage(urlLang);
          console.log('Language updated from URL parameter:', urlLang);
          return;
        }
      } catch (e) {
        console.warn('Error getting language from URL:', e);
      }
    };

    /**
     * Xrmから言語を取得して更新（Power Apps内で開いた場合）
     */
    const updateLanguageFromXrm = () => {
      try {
        let xrm: any = null;
        if ((window as any).Xrm) {
          xrm = (window as any).Xrm;
        } else if (window.parent && window.parent !== window) {
          try {
            if ((window.parent as any).Xrm) {
              xrm = (window.parent as any).Xrm;
            }
          } catch (e) {
            // クロスオリジンの場合は無視
          }
        } else if (window.top && window.top !== window) {
          try {
            if ((window.top as any).Xrm) {
              xrm = (window.top as any).Xrm;
            }
          } catch (e) {
            // クロスオリジンの場合は無視
          }
        }

        if (xrm && typeof xrm.Utility?.getGlobalContext === 'function') {
          const context = xrm.Utility.getGlobalContext();
          const langId = context.userSettings?.languageId;
          const lang = langId === 1041 ? 'ja' : langId === 1033 ? 'en' : null;
          if (lang) {
            i18n.changeLanguage(lang);
            console.log('Language updated from Xrm:', lang);
          }
        }
      } catch (e) {
        console.warn('Error getting language from Xrm:', e);
      }
    };

    // 初回実行：URLパラメータを最優先でチェック
    updateLanguageFromUrl();

    // URLパラメータがない場合のみ、Xrmから取得を試行
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang') || params.get('language');
    if (!urlLang || (urlLang !== 'ja' && urlLang !== 'en')) {
      updateLanguageFromXrm();
    }
  }, [i18n]);

  return (
    <div className="app">
      <main className="app-main">
        {partsNumber ? (
          <PartsDetail partsNumber={partsNumber} />
        ) : (
          <PartsSearch />
        )}
      </main>
    </div>
  );
}

export default App;
