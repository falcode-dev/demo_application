import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './i18n/config';
import './App.css';
import { PartsRegistration } from './pages/PartsRegistration';
import { PartsDetail } from './pages/PartsDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [partsNumber, setPartsNumber] = useState<string | null>(null);

  useEffect(() => {
    // URLパラメータからpartsNumberを取得
    const params = new URLSearchParams(window.location.search);
    const partsNum = params.get('partsNumber');
    setPartsNumber(partsNum);
  }, []);

  const handleBack = () => {
    setPartsNumber(null);
    // URLを更新
    window.history.pushState({}, '', window.location.pathname);
  };

  // ブラウザの戻る/進むボタンに対応
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const partsNum = params.get('partsNumber');
      setPartsNumber(partsNum);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <main className="app-main">
          {partsNumber ? (
            <PartsDetail
              partsNumber={partsNumber}
            />
          ) : (
            <PartsRegistration />
          )}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
