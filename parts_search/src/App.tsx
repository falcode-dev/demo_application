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
     * Power Appsから言語設定を取得して更新
     * 別タブで開いた場合でも、postMessageで言語情報を受け取れるようにする
     */
    const updateLanguageFromPowerApps = () => {
      try {
        // URLパラメータから言語を取得
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang') || params.get('language');
        if (urlLang === 'ja' || urlLang === 'en') {
          i18n.changeLanguage(urlLang);
          return;
        }

        // Xrmから言語を取得
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
          }
        }
      } catch (e) {
        console.warn('Error updating language from Power Apps:', e);
      }
    };

    // 初回実行
    updateLanguageFromPowerApps();

    // postMessageで言語変更を受け取る（Power Appsから送信される場合）
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'languageChange' && (event.data.language === 'ja' || event.data.language === 'en')) {
        i18n.changeLanguage(event.data.language);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
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
