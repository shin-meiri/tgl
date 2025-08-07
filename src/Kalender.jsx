// Kalender.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [daftarLibur, setDaftarLibur] = useState({});
  const [cssLoaded, setCssLoaded] = useState(false);

  const hariNama = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const bulanNama = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const bulanPanjang = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const EPOCH = new Date(1899, 11, 31);
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  // Fungsi getWeton — stabil karena tidak pakai state/props
  const getWeton = (date) => {
    const diff = Math.floor((date - EPOCH) / MS_PER_DAY);
    return pasaran[diff % 5];
  };

  // Muat CSS dari API
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await axios.get('/api/theme.php');
        const css = res.data.css;

        let style = document.getElementById('dynamic-css');
        if (!style) {
          style = document.createElement('style');
          style.id = 'dynamic-css';
          document.head.appendChild(style);
        }
        style.textContent = css;
      } catch (err) {
        console.error('Gagal muat tema:', err);
      } finally {
        setCssLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Muat libur dari API
  useEffect(() => {
    const loadLibur = async () => {
      try {
        const res = await axios.get('/api/libur.php');
        const liburMap = {};
        res.data.libur.forEach(l => {
          liburMap[l.tanggal] = l.nama;
        });
        setDaftarLibur(liburMap);
      } catch (err) {
        console.error('Gagal muat libur:', err);
      }
    };
    loadLibur();
  }, []);

  // generateCalendar — dibungkus useCallback
  const generateCalendar = useCallback((date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const days = [];

    // Bulan lalu
    const prevLast = new Date(y, m, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ d: prevLast - i, cur: false, w: null });
    }

    // Bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const full = new Date(y, m, day);
      days.push({
        d: day,
        cur: true,
        dow: full.getDay(),
        weton: getWeton(full),
        libur: daftarLibur[`${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`]
      });
    }

    // Bulan depan
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      days.push({ d: day, cur: false, w: null });
    }

    setDaysInMonth(days);
  }, [daftarLibur, getWeton]); // ✅ Semua dependensi terpenuhi

  // Generate saat currentDate berubah
  useEffect(() => {
    if (cssLoaded) {
      generateCalendar(currentDate);
    }
  }, [currentDate, generateCalendar, cssLoaded]); // ✅ generateCalendar dimasukkan

  // Navigasi
  const goToPrev = () => {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const goToNext = () => {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

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
    if (/^\d{0,4}$/.test(v)) {
      setTempYear(v === '' ? '' : Number(v));
    }
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
      {/* Header */}
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
                <div
                  key={b}
                  className={`month-cell ${i === currentMonth ? 'selected' : ''}`}
                  onClick={() => selectMonth(i)}
                >
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hari Header */}
      <div className="hari-header">
        {hariNama.map((h) => (
          <div key={h} className={`hari-label ${h === 'Min' ? 'sunday' : ''}`}>
            {h}
          </div>
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
              isToday(day) && 'today',
            ]
              .filter(Boolean)
              .join(' ')}
            title={day.libur || ''}
          >
            <span className="date-number">{day.d}</span>
            {day.cur && <span className="weton">{day.weton}</span>}
            {day.libur && <span className="libur-badge">🎉</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kalender;
