// App.js
import React, { useState } from 'react';
import Kalender from './Kalender';
import Weton from './Weton';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('kalender');

  return (
    <div className="app">
      {/* Menubar Navigasi */}
      <nav className="menubar">
        <button
          className={activeTab === 'kalender' ? 'active' : ''}
          onClick={() => setActiveTab('kalender')}
        >
          📅 Kalender
        </button>
        <button
          className={activeTab === 'weton' ? 'active' : ''}
          onClick={() => setActiveTab('weton')}
        >
          🧭 Weton
        </button>
      </nav>

      {/* Konten Utama */}
      <main className="main-content">
        {activeTab === 'kalender' && <Kalender />}
        {activeTab === 'weton' && <Weton />}
      </main>
    </div>
  );
};

export default App;
