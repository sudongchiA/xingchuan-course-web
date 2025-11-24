import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the root element on the page (required for GitHub Pages deployment)
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

// Correct React 18 initialization
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
