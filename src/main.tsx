import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/app/App';
import '@/styles/global.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element #root not found');
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fbf5f7',
              color: '#3a2072',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Loading Apex Bank…
          </div>
        }
      >
        <App />
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
