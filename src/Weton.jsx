// Weton.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Neptu hari & pasaran
const NEPTU_HARI = {
  'Min': 5, 'Sen': 4, 'Sel': 3, 'Rab': 7, 'Kam': 8, 'Jum': 6, 'Sab': 9
};

const NEPTU_PASARAN = {
  'Legi': 5, 'Pahing': 9, 'Pon': 7, 'Wage': 4, 'Kliwon': 8
};

// Arah weton
const ARAH_WETON = {
  'Legi': 'Timur',
  'Pahing': 'Selatan',
  'Pon': 'Barat',
  'Wage': 'Utara',
  'Kliwon': 'Pusat'
};

const Weton = () => {
  const [todayWeton, setTodayWeton] = useState(null);
  const [cssLoaded, setCssLoaded] = useState(false);

  // Titik acuan: 1 Jan 1900 = Legi
  const EPOCH = new Date(1899, 11, 31);
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  // Fungsi hitung weton
  const getWeton = (date) => {
    const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
    const diff = Math.floor((date - EPOCH) / MS_PER_DAY);
    return pasaran[diff % 5];
  };

  // Ambil nama hari
  const getDayName = (date) => {
    const names = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return names[date.getDay()];
  };

  // Hitung hari ini
  useEffect(() => {
    const today = new Date();
    const hari = getDayName(today);
    const weton = getWeton(today);
    const neptuHari = NEPTU_HARI[hari];
    const neptuWeton = NEPTU_PASARAN[weton];
    const arah = ARAH_WETON[weton];
    const totalNeptu = neptuHari + neptuWeton;

    setTodayWeton({
      tanggal: today.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      hari,
      weton,
      neptuHari,
      neptuWeton,
      arah,
      totalNeptu
    });
  }, []);

  // Muat CSS dari MySQL
  useEffect(() => {
    const loadCSS = async () => {
      try {
        const res = await axios.get('/api/theme.php');
        const css = res.data.css;

        let style = document.getElementById('dynamic-css-weton');
        if (!style) {
          style = document.createElement('style');
          style.id = 'dynamic-css-weton';
          document.head.appendChild(style);
        }
        style.textContent = css;
      } catch (err) {
        console.error('Gagal muat CSS:', err);
      } finally {
        setCssLoaded(true);
      }
    };
    loadCSS();
  }, []);

  if (!cssLoaded || !todayWeton) return <div className="loading">Memuat...</div>;

  return (
    <div className="weton-container">
      <h3>🧭 Weton & Arah Spiritual</h3>

      {/* Info Utama */}
      <div className="weton-info">
        <p><strong>Hari Ini:</strong> {todayWeton.tanggal}</p>
        <p><strong>Neptu Hari:</strong> {todayWeton.hari} ({todayWeton.neptuHari})</p>
        <p><strong>Weton:</strong> {todayWeton.weton} ({todayWeton.neptuWeton})</p>
        <p><strong>Arah Ke:</strong> <span className="arah-bold">{todayWeton.arah}</span></p>
        <p><strong>Jumlah Neptu:</strong> {todayWeton.totalNeptu}</p>
      </div>

      {/* Diagram Mata Angin */}
      <div className="mata-angin-diagram">
        <div className="utara">
          <span>Utara</span>
          <small>Wage</small>
          {todayWeton.weton === 'Wage' && <span className="active-arrow">↑</span>}
        </div>
        <div className="barat">
          <span>Barat</span>
          <small>Pon</small>
          {todayWeton.weton === 'Pon' && <span className="active-arrow">←</span>}
        </div>
        <div className="pusat">
          <span>Kliwon</span>
          <small>Pusat</small>
          {todayWeton.weton === 'Kliwon' && <span className="active-dot">•</span>}
        </div>
        <div className="timur">
          <span>Timur</span>
          <small>Legi</small>
          {todayWeton.weton === 'Legi' && <span className="active-arrow">→</span>}
        </div>
        <div className="selatan">
          <span>Selatan</span>
          <small>Pahing</small>
          {todayWeton.weton === 'Pahing' && <span className="active-arrow">↓</span>}
        </div>
      </div>
    </div>
  );
};

export default Weton;
