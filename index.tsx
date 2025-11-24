import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 尝试获取已有 root，没有就自己创建一个
const rootElement =
  document.getElementById('root') ||
  (() => {
    const el = document.createElement('div');
    el.id = 'root';
    document.body.appendChild(el);
    return el;
  })();

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
