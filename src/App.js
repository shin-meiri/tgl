// src/App.jsx
import React, { useEffect } from 'react';
import Header from './components/Header';
import Kalender from './components/Kalender';

const App = () => {
  // Load CSS dari theme.php (dari database)
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'theme.php'; // Ganti dengan domain kamu
    link.id = 'dynamic-theme';
    document.head.appendChild(link);

    return () => {
      const existing = document.getElementById('dynamic-theme');
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  return (
    <div className="app">
      <Header />
      <main className="p-6">
        <Kalender />
      </main>
    </div>
  );
};

export default App;
