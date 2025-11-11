import 'react-datepicker/dist/react-datepicker.css';
import './i18n/config';
import './App.css';
import { PartsRegistration } from './pages/PartsRegistration';
import { PartsDetail } from './pages/PartsDetail';
import { useUrlParams } from './hooks/useUrlParams';
import { ToastContainer } from './components';
import { useToast } from './hooks/useToast';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  const partsNumber = useUrlParams();
  const { toasts, removeToast, success, error, info, warning } = useToast();

  return (
    <ToastProvider value={{ success, error, info, warning }}>
      <div className="app">
        <main className="app-main">
          {partsNumber ? (
            <PartsDetail partsNumber={partsNumber} />
          ) : (
            <PartsRegistration />
          )}
        </main>
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </ToastProvider>
  );
}

export default App;
