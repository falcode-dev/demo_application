import './App.css';
import './i18n/config';
import { PartsSearch } from './pages/PartsSearch';
import { PartsDetail } from './pages/PartsDetail';
import { useUrlParams } from './hooks/useUrlParams';

function App() {
  const partsNumber = useUrlParams();

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
