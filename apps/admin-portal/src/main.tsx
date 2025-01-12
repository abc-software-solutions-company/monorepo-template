import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import '@repo/react-web-ui-shadcn/globals.scss';
import '@/globals.scss';

const domElementId = 'root';
const rootElement = document.getElementById(domElementId);

if (!rootElement) {
  throw new Error(`Element with id ${domElementId} not found`);
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
