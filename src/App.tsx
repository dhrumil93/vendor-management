import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { store } from '@/app/store';
import { AppRouter } from '@/router/AppRouter';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Toaster position="top-right" richColors closeButton />
        <AppRouter />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
