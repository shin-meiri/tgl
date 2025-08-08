// Weton.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Tema resmi

// --- KONSTANTA LUAR KOMPONEN ---
const EPOCH = new Date(1899, 11, 31);
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

// --- FUNGSI LUAR KOMPONEN ---
const getWeton = (date) => {
  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const diff = Math.floor((date - EPOCH) / MS_PER_DAY);
  return pasaran[diff % 5];
};

const getDayName = (date) => {
  const names = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  return names[date.getDay()];
};

const isAfterSunset = () => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 18;
};

// --- KOMPONEN UTAMA ---
const Weton = () => {
  const [todayWeton, setTodayWeton] = useState(null);
  const [customWeton, setCustomWeton] = useState(null);
  const [cssLoaded, setCssLoaded] = useState(false);
  const datePickerRef = useRef(null);

  // Hitung weton hari ini (dengan aturan 18:00)
  useEffect(() => {
    const now = new Date();
    let baseDate = new Date(now);

    if (isAfterSunset()) {
      baseDate.setDate(now.getDate() + 1);
    }

    const hari = getDayName(baseDate);
    const weton = getWeton(baseDate);
    const neptuHari = NEPTU_HARI[hari];
    const neptuWeton = NEPTU_PASARAN[weton];
    const arah = ARAH_WETON[weton];
    const totalNeptu = neptuHari + neptuWeton;

    const displayDate = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    setTodayWeton({
      tanggal: displayDate,
      hari,
      weton,
      neptuHari,
      neptuWeton,
      arah,
      totalNeptu,
      isAfterSunset: isAfterSunset()
    });
  }, []);

  // Inisialisasi flatpickr
  useEffect(() => {
    if (datePickerRef.current) {
      flatpickr(datePickerRef.current, {
        dateFormat: 'd F Y',
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
            hitungWetonCustom(selectedDates[0]);
          }
        }
      });
    }

    return () => {
      // Cleanup jika perlu
    };
  }, []);

  // Fungsi hitung weton custom
  const hitungWetonCustom = useCallback((date) => {
    const hari = getDayName(date);
    const weton = getWeton(date);
    const neptuHari = NEPTU_HARI[hari];
    const neptuWeton = NEPTU_PASARAN[weton];
    const arah = ARAH_WETON[weton];
    const totalNeptu = neptuHari + neptuWeton;

    const formattedDate = date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    setCustomWeton({
      tanggal: formattedDate,
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
        const style = document.getElementById('dynamic-css-weton') || document.createElement('style');
        style.id = 'dynamic-css-weton';
        style.textContent = css;
        if (!style.isConnected) document.head.appendChild(style);
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

      {/* Weton Hari Ini */}
      <div className="weton-info">
        <h4>📅 Weton Hari Ini</h4>
        <p><strong>Tanggal:</strong> {todayWeton.tanggal}</p>
        <p><strong>Hari:</strong> {todayWeton.hari} ({todayWeton.neptuHari})</p>
        <p><strong>Weton:</strong> {todayWeton.weton} ({todayWeton.neptuWeton})</p>
        <p><strong>Arah Ke:</strong> <span className="arah-bold">{todayWeton.arah}</span></p>
        <p><strong>Neptu Total:</strong> {todayWeton.totalNeptu}</p>
        <p className="small-text">
          <em>{todayWeton.isAfterSunset ? 'Weton sudah berganti (setelah 18:00)' : 'Masih weton hari ini'}</em>
        </p>
      </div>

      {/* Input Cek Weton Tanggal Lain */}
      <div className="custom-input">
        <h4>🔍 Cek Weton Tanggal Lain</h4>
        <input
          ref={datePickerRef}
          type="text"
          placeholder="Pilih tanggal"
          className="flatpickr-input"
        />
      </div>

      {/* Hasil Custom */}
      {customWeton && (
        <div className="weton-info custom-result">
          <h4>🎯 Hasil untuk {customWeton.tanggal}</h4>
          <p><strong>Hari:</strong> {customWeton.hari} ({customWeton.neptuHari})</p>
          <p><strong>Weton:</strong> {customWeton.weton} ({customWeton.neptuWeton})</p>
          <p><strong>Arah Ke:</strong> <span className="arah-bold">{customWeton.arah}</span></p>
          <p><strong>Neptu Total:</strong> {customWeton.totalNeptu}</p>
        </div>
      )}

      {/* Diagram Mata Angin */}
      <div className="mata-angin-diagram">
        <div className={`utara ${customWeton?.weton === 'Wage' || todayWeton.weton === 'Wage' ? 'active' : ''}`}>
          <span>Utara</span>
          <small>Wage</small>
          {(customWeton?.weton === 'Wage' || todayWeton.weton === 'Wage') && <span className="active-arrow">↑</span>}
        </div>
        <div className={`barat ${customWeton?.weton === 'Pon' || todayWeton.weton === 'Pon' ? 'active' : ''}`}>
          <span>Barat</span>
          <small>Pon</small>
          {(customWeton?.weton === 'Pon' || todayWeton.weton === 'Pon') && <span className="active-arrow">←</span>}
        </div>
        <div className={`pusat ${customWeton?.weton === 'Kliwon' || todayWeton.weton === 'Kliwon' ? 'active' : ''}`}>
          <span>Kliwon</span>
          <small>Pusat</small>
          {(customWeton?.weton === 'Kliwon' || todayWeton.weton === 'Kliwon') && <span className="active-dot">•</span>}
        </div>
        <div className={`timur ${customWeton?.weton === 'Legi' || todayWeton.weton === 'Legi' ? 'active' : ''}`}>
          <span>Timur</span>
          <small>Legi</small>
          {(customWeton?.weton === 'Legi' || todayWeton.weton === 'Legi') && <span className="active-arrow">→</span>}
        </div>
        <div className={`selatan ${customWeton?.weton === 'Pahing' || todayWeton.weton === 'Pahing' ? 'active' : ''}`}>
          <span>Selatan</span>
          <small>Pahing</small>
          {(customWeton?.weton === 'Pahing' || todayWeton.weton === 'Pahing') && <span className="active-arrow">↓</span>}
        </div>
      </div>
    </div>
  );
};

export default Weton;
