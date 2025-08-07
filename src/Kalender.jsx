// Kalender.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- KONSTANTA LUAR KOMPONEN ---
const EPOCH = new Date(1899, 11, 31);
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

// --- FUNGSI LUAR KOMPONEN (STABIL, TIDAK BERUBAH) ---
const getWeton = (date) => {
  const diff = Math.floor((date - EPOCH) / MS_PER_DAY);
  return PASARAN[diff % 5];
};

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [daftarLibur, setDaftarLibur] = useState([]);
  const [cssLoaded, setCssLoaded] = useState(false);

  const hariNama = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const bulanNama = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const bulanPanjang = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Muat CSS dari MySQL
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await axios.get('/api/theme.php');
        const css = res.data.css;
        const style = document.getElementById('dynamic-css') || document.createElement('style');
        style.id = 'dynamic-css';
        style.textContent = css;
        if (!document.getElementById('dynamic-css')) {
          document.head.appendChild(style);
        }
      } catch (err) {
        console.error('Gagal muat tema:', err);
      } finally {
        setCssLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Muat libur dari MySQL
  useEffect(() => {
    const fetchLibur = async () => {
      try {
        const res = await axios.get('/api/libur.php');
        setDaftarLibur(res.data.libur || []);
      } catch (err) {
        console.error('Gagal muat libur:', err);
        setDaftarLibur([]);
      }
    };
    fetchLibur();
  }, []);

  // Buat map libur: '2025-01-01' => libur
  const liburMap = daftarLibur.reduce((map, libur) => {
    map[libur.tanggal] = libur;
    return map;
  }, {});

  // Generate kalender — getWeton tidak perlu di dep karena di luar komponen
  const generateCalendar = useCallback((date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const days = [];

    // Bulan lalu
    const prevLast = new Date(y, m, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ d: prevLast - i, cur: false });
    }

    // Bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const full = new Date(y, m, day);
      const dateString = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const libur = liburMap[dateString];

      days.push({
        d: day,
        cur: true,
        dow: full.getDay(),
        weton: getWeton(full),
        libur: !!libur,
        namaLibur: libur ? libur.nama : ''
      });
    }

    // Bulan depan
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      days.push({ d: day, cur: false });
    }

    setDaysInMonth(days);
  }, [liburMap]); // ✅ Hanya liburMap yang bisa berubah

  // Update kalender saat currentDate berubah
  useEffect(() => {
    if (cssLoaded) {
      generateCalendar(currentDate);
    }
  }, [currentDate, generateCalendar, cssLoaded]);

  // Navigasi
  const goToPrev = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goToNext = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const openPicker = () => {
    setTempYear(currentDate.getFullYear());
    setShowMonthPicker(true);
  };

  const selectMonth = (idx) => {
    setCurrentDate(d => {
      const c = new Date(d);
      c.setMonth(idx);
      c.setFullYear(tempYear || c.getFullYear());
      return c;
    });
    setShowMonthPicker(false);
  };

  const handleYear = (e) => {
    const v = e.target.value;
    if (/^\d{0,4}$/.test(v)) setTempYear(v === '' ? '' : Number(v));
  };

  const applyYear = () => {
    if (tempYear) {
      setCurrentDate(d => {
        const c = new Date(d);
        c.setFullYear(tempYear);
        return c;
      });
    }
  };

  // Cek hari ini
  const today = new Date();
  const isToday = (dayObj) =>
    dayObj.cur &&
    today.getDate() === dayObj.d &&
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear();

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  if (!cssLoaded) return <div className="loading">Memuat tema...</div>;

  return (
    <div className="kalender-container">
      {/* Header Kalender */}
      <div className="kalender-header">
        <button type="button" className="nav-btn" onClick={goToPrev}>⬅️</button>
        <div className="month-display" onClick={openPicker}>
          {bulanPanjang[currentMonth]} {currentYear}
        </div>
        <button type="button" className="nav-btn" onClick={goToNext}>➡️</button>
      </div>

      {/* Month Picker */}
      {showMonthPicker && (
        <div className="month-picker-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="month-picker">
            <div className="year-input">
              <input
                type="number"
                value={tempYear}
                onChange={handleYear}
                onBlur={applyYear}
                onKeyPress={(e) => e.key === 'Enter' && applyYear()}
                placeholder="Tahun"
                className="year-edit"
              />
            </div>
            <div className="months-grid">
              {bulanNama.map((b, i) => (
                <div key={b} className={`month-cell ${i === currentMonth ? 'selected' : ''}`} onClick={() => selectMonth(i)}>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header Hari */}
      <div className="hari-header">
        {hariNama.map(h => (
          <div key={h} className={`hari-label ${h === 'Min' ? 'sunday' : ''}`}>{h}</div>
        ))}
      </div>

      {/* Grid Tanggal */}
      <div className="dates-grid">
        {daysInMonth.map((day, i) => (
          <div
            key={i}
            className={[
              'date-box',
              !day.cur && 'outside',
              day.dow === 0 && 'sunday',
              day.libur && 'libur',
              isToday(day) && 'today'
            ].filter(Boolean).join(' ')}
            title={day.namaLibur || ''}
          >
            <span className="date-number">{day.d}</span>
            {day.cur && <span className="weton">{day.weton}</span>}
          </div>
        ))}
      </div>

      {/* Tabel Keterangan Libur */}
      <div className="libur-table-container">
        <h4>📅 Keterangan Hari Libur</h4>
        {daftarLibur.length === 0 ? (
          <p>Tidak ada libur.</p>
        ) : (
          <table className="libur-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {daftarLibur.map((l, i) => (
                <tr key={l.tanggal}>
                  <td>{i + 1}</td>
                  <td>{l.tanggal}</td>
                  <td>{l.nama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Kalender;
