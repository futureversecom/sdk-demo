import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import { BrowserRouter } from 'react-router-dom';
import Providers from './Providers/FVProvider';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Providers>
  </React.StrictMode>
);
