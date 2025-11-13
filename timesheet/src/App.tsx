import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FiHome } from 'react-icons/fi';
import 'react-datepicker/dist/react-datepicker.css';
import './i18n/config';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { t } = useTranslation();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header className="app-header">
          <FiHome size={24} />
          <h1>{t('welcome')}</h1>
        </header>
        <main className="app-main">
          <p>ベースプロジェクトが準備できました。</p>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
