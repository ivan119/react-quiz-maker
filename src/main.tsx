import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeContextProvider } from './app/context/ThemeContext';
import App from './app/App';

async function enableMocking() {
  const isDevelopment = import.meta.env.MODE === 'development';
  const isMockEnabled = import.meta.env.VITE_ENABLE_MOCKS === 'true';
  if (!isDevelopment || !isMockEnabled) {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </React.StrictMode>
  );
});
