// Weton.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- KONSTANTA LUAR KOMPONEN ---
const EPOCH = new Date(1899, 11, 31); // 31 Des 1899 → 1 Jan 1900 = Legi
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const NEPTU_HARI = {
  Min: 5, Sen: 4, Sel: 3, Rab: 7, Kam: 8, Jum: 6, Sab: 9
};

const NEPTU_PASARAN = {
  Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8
};

const ARAH_WETON = {
  Legi: 'Timur',
  Pahing: 'Selatan',
  Pon: 'Barat',
  Wage: 'Utara',
  Kliwon: 'Pusat'
};

// --- FUNGSI LUAR KOMPONEN (STABIL, TIDAK BERUBAH) ---
const getWeton = (date) => {
  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const diff = Math.floor((date - EPOCH) / MS_PER_DAY);
  return pasaran[diff % 5];
};

const getDayName = (date) => {
  const names = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  return names[date.getDay()];
};

// --- KOMPONEN UTAMA ---
const Weton = () => {
  const [todayWeton, setTodayWeton] = useState(null);
  const [cssLoaded, setCssLoaded] = useState(false);

  // Hitung weton hari ini
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
  }, []); // ✅ Tidak perlu dependensi karena semua fungsi di luar

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
  }, []); // ✅ Hanya dijalankan sekali

  if (!cssLoaded || !todayWeton) return <div className="loading">Memuat...</div>;

  return (
    <div className="weton-container">
      <h3>🧭 Weton & Arah Spiritual</h3>

      <div className="weton-info">
        <p><strong>Hari Ini:</strong> {todayWeton.tanggal}</p>
        <p><strong>Neptu Hari:</strong> {todayWeton.hari} ({todayWeton.neptuHari})</p>
        <p><strong>Weton:</strong> {todayWeton.weton} ({todayWeton.neptuWeton})</p>
        <p><strong>Arah Ke:</strong> <span className="arah-bold">{todayWeton.arah}</span></p>
        <p><strong>Jumlah Neptu:</strong> {todayWeton.totalNeptu}</p>
      </div>

      <div className="mata-angin-diagram">
        <div className={`utara ${todayWeton.weton === 'Wage' ? 'active' : ''}`}>
          <span>Utara</span>
          <small>Wage</small>
          {todayWeton.weton === 'Wage' && <span className="active-arrow">↑</span>}
        </div>
        <div className={`barat ${todayWeton.weton === 'Pon' ? 'active' : ''}`}>
          <span>Barat</span>
          <small>Pon</small>
          {todayWeton.weton === 'Pon' && <span className="active-arrow">←</span>}
        </div>
        <div className={`pusat ${todayWeton.weton === 'Kliwon' ? 'active' : ''}`}>
          <span>Kliwon</span>
          <small>Pusat</small>
          {todayWeton.weton === 'Kliwon' && <span className="active-dot">•</span>}
        </div>
        <div className={`timur ${todayWeton.weton === 'Legi' ? 'active' : ''}`}>
          <span>Timur</span>
          <small>Legi</small>
          {todayWeton.weton === 'Legi' && <span className="active-arrow">→</span>}
        </div>
        <div className={`selatan ${todayWeton.weton === 'Pahing' ? 'active' : ''}`}>
          <span>Selatan</span>
          <small>Pahing</small>
          {todayWeton.weton === 'Pahing' && <span className="active-arrow">↓</span>}
        </div>
      </div>
    </div>
  );
};

export default Weton;
