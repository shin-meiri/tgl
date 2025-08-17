import 'flatpickr/dist/flatpickr.min.css';
import React, { useEffect } from 'react';
import Kalender from './Kalender';

function App() {
  // ✅ useEffect dipakai di dalam komponen
  useEffect(() => {
    // Ambil CSS dari API
    fetch('/api/style.php')
      .then(res => res.text())
      .then(css => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
      })
      .catch(err => {
        console.error('Gagal muat CSS dari server:', err);
      });
  }, []); // [] = jalan sekali saat mount

  return (
    <div className="App">
      <Kalender />
    </div>
  );
}

export default App;
