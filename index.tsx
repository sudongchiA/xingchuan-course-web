// Import React core
import React from 'react';

// Import ReactDOM (React 18 uses createRoot)
import ReactDOM from 'react-dom/client';

// Import main App component
import App from './App';

// Ensure the #root element exists in index.html
const rootElement = document.getElementById('root');

if (!rootElement) {
  // Throw error for GitHub Pages debugging
  throw new Error('❌ Root element (#root) not found. Please ensure <div id="root"></div> exists in index.html');
}

// Correct React 18 createRoot initialization
const root = ReactDOM.createRoot(rootElement);

// Render App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
