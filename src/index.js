import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

fetch('./api/style.php')
  .then(res => res.text())
  .then(css => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    startApp(); // Mulai React setelah CSS siap
  })
  .catch(() => {
    // Fallback CSS jika gagal
    const fallback = `
      body { font-family: Arial, sans-serif; }
      .header-nav { background: #000; color: white; display: flex; }
      .nav-item { padding: 10px; cursor: pointer; }
      .nav-item.active { background: white; color: black; }
    `;
    const style = document.createElement('style');
    style.textContent = fallback;
    document.head.appendChild(style);
    startApp();
  });

function startApp() {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<div id="app"></div>';
    // React akan mount ke #app
  }
  // Lanjutkan ke App
         }
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
