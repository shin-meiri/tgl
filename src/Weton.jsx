// Weton.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// --- Konstanta Weton ---
const EPOCH = new Date(1899, 11, 31); // 31 Des 1899 → 1 Jan 1900 = Legi
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const NEPTU_HARI = { Min: 5, Sen: 4, Sel: 3, Rab: 7, Kam: 8, Jum: 6, Sab: 9 };
const NEPTU_PASARAN = { Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8 };
const ARAH_WETON = {
  Legi: 'Timur',
  Pahing: 'Selatan',
  Pon: 'Barat',
  Wage: 'Utara',
  Kliwon: 'Pusat'
};

// --- Fungsi Luar Komponen ---
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
  const [wetonInfo, setWetonInfo] = useState(null);
  const [cssLoaded, setCssLoaded] = useState(false);
  const flatpickrRef = useRef(null); // Untuk container flatpickr

  // Hitung weton dari tanggal
  const hitungWeton = (date) => {
    // Cek apakah sudah lewat 18:00 → weton = besok
    const isAfterSunset = date.getHours() >= 18;
    const baseDate = new Date(date);
    if (isAfterSunset) {
      baseDate.setDate(baseDate.getDate() + 1);
    }

    const hari = getDayName(baseDate);
    const weton = getWeton(baseDate);
    const neptuHari = NEPTU_HARI[hari];
    const neptuWeton = NEPTU_PASARAN[weton];
    const arah = ARAH_WETON[weton];
    const totalNeptu = neptuHari + neptuWeton;

    const formattedDate = baseDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    setWetonInfo({
      tanggal: formattedDate,
      hari,
      weton,
      neptuHari,
      neptuWeton,
      arah,
      totalNeptu,
      isAfterSunset
    });
  };

  // Inisialisasi flatpickr (inline, seperti Excel)
  useEffect(() => {
    if (flatpickrRef.current) {
      const fp = flatpickr(flatpickrRef.current, {
        inline: true,           // Tampilkan langsung, bukan input
        defaultDate: new Date(), // Default = hari ini
        dateFormat: 'Y-m-d',
        locale: {
          firstDayOfWeek: 1,
          weekdays: {
            shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
            longhand: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
          },
          months: {
            shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
            longhand: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
          }
        },
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            hitungWeton(selectedDates[0]);
          }
        }
      });

      // Hitung weton untuk hari ini saat pertama kali
      hitungWeton(new Date());

      return () => fp.destroy();
    }
  }, []);

  // Muat CSS dari MySQL
  useEffect(() => {
    axios.get('/api/theme.php')
      .then(res => {
        const style = document.createElement('style');
        style.id = 'dynamic-css-weton';
        style.textContent = res.data.css;
        if (!document.getElementById('dynamic-css-weton')) {
          document.head.appendChild(style);
        }
      })
      .catch(err => console.error('Gagal muat CSS:', err))
      .finally(() => setCssLoaded(true));
  }, []);

  if (!cssLoaded || !wetonInfo) return <div className="loading">Memuat...</div>;

  return (
    <div className="weton-container">
      <h3>🧭 Weton & Arah Spiritual</h3>

      {/* Flatpickr Inline - TAMPIL LANGSUNG SEPERTI EXCEL */}
      <div ref={flatpickrRef} className="flatpickr-inline"></div>

      {/* Deskripsi Hasil */}
      <div className="weton-result">
        <h4>📅 Informasi Weton</h4>
        <p><strong>Tanggal:</strong> {wetonInfo.tanggal}</p>
        <p><strong>Hari:</strong> {wetonInfo.hari} ({wetonInfo.neptuHari})</p>
        <p><strong>Weton:</strong> {wetonInfo.weton} ({wetonInfo.neptuWeton})</p>
        <p><strong>Arah Ke:</strong> <span className="arah-bold">{wetonInfo.arah}</span></p>
        <p><strong>Neptu Total:</strong> {wetonInfo.totalNeptu}</p>
        <p className="small-text">
          <em>{wetonInfo.isAfterSunset ? 'Weton sudah berganti (setelah 18:00)' : 'Masih weton hari ini'}</em>
        </p>
      </div>

      {/* Diagram Mata Angin */}
      <div className="mata-angin-diagram">
        <div className={`utara ${wetonInfo.weton === 'Wage' ? 'active' : ''}`}>
          <span>Utara</span>
          <small>Wage</small>
          {wetonInfo.weton === 'Wage' && <span className="active-arrow">↑</span>}
        </div>
        <div className={`barat ${wetonInfo.weton === 'Pon' ? 'active' : ''}`}>
          <span>Barat</span>
          <small>Pon</small>
          {wetonInfo.weton === 'Pon' && <span className="active-arrow">←</span>}
        </div>
        <div className={`pusat ${wetonInfo.weton === 'Kliwon' ? 'active' : ''}`}>
          <span>Kliwon</span>
          <small>Pusat</small>
          {wetonInfo.weton === 'Kliwon' && <span className="active-dot">•</span>}
        </div>
        <div className={`timur ${wetonInfo.weton === 'Legi' ? 'active' : ''}`}>
          <span>Timur</span>
          <small>Legi</small>
          {wetonInfo.weton === 'Legi' && <span className="active-arrow">→</span>}
        </div>
        <div className={`selatan ${wetonInfo.weton === 'Pahing' ? 'active' : ''}`}>
          <span>Selatan</span>
          <small>Pahing</small>
          {wetonInfo.weton === 'Pahing' && <span className="active-arrow">↓</span>}
        </div>
      </div>
    </div>
  );
};

export default Weton;
