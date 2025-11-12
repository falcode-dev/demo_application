import './App.css';
import './i18n/config';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PartsSearch } from './pages/PartsSearch';
import { PartsDetail } from './pages/PartsDetail';
import { useUrlParams } from './hooks/useUrlParams';

function App() {
  const partsNumber = useUrlParams();
  const { i18n } = useTranslation();

  // URLパラメータの言語変更を監視してi18nの言語を更新
  useEffect(() => {
    const updateLanguage = () => {
      const params = new URLSearchParams(window.location.search);
      const lang = params.get('lang');
      if (lang === 'ja' || lang === 'en') {
        if (i18n.language !== lang) {
          i18n.changeLanguage(lang);
        }
      }
    };

    // 初回読み込み時
    updateLanguage();

    // URL変更を監視
    const handlePopState = () => {
      updateLanguage();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
