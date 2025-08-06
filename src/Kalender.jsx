// Kalender.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Kalender.css';

// Titik acuan: 31 Des 1899 → 1 Jan 1900 = Legi
const EPOCH = new Date(1899, 11, 31);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState([]);

  const hariNama = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const bulanNama = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const bulanPanjang = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

  // Hitung weton
  const getWeton = (date) => {
    const diffTime = date - EPOCH;
    const diffDays = Math.floor(diffTime / MS_PER_DAY);
    return pasaran[diffDays % 5];
  };

  // Generate kalender — dibungkus useCallback
  const generateCalendarDays = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInThisMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Bulan lalu
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: prevMonthLastDay - i, isCurrentMonth: false, dayOfWeek: (6 - i) % 7, weton: null });
    }

    // Bulan ini
    for (let day = 1; day <= daysInThisMonth; day++) {
      const fullDate = new Date(year, month, day);
      days.push({
        date: day,
        isCurrentMonth: true,
        dayOfWeek: fullDate.getDay(),
        weton: getWeton(fullDate),
      });
    }

    // Bulan depan
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: day,
        isCurrentMonth: false,
        dayOfWeek: nextDate.getDay(),
        weton: null,
      });
    }

    setDaysInMonth(days);
  }, [getWeton]); // ✅ generateCalendarDays stabil selama getWeton stabil

  // Navigasi
  const goToPrevMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const openMonthPicker = () => {
    setTempYear(currentDate.getFullYear());
    setShowMonthPicker(true);
  };

  const selectMonth = (monthIndex) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(monthIndex);
      d.setFullYear(tempYear || d.getFullYear());
      return d;
    });
    setShowMonthPicker(false);
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setTempYear(value === '' ? '' : Number(value));
    }
  };

  const applyYear = () => {
    if (tempYear) {
      setCurrentDate(prev => {
        const d = new Date(prev);
        d.setFullYear(tempYear);
        return d;
      });
    }
  };

  // Ambil data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5');
        console.log('Data:', res.data);
      } catch (err) {
        console.error('Error:', err.message);
      }
    };
    fetchData();
  }, [currentDate]); // ✅ hanya berjalan saat currentDate berubah

  // Generate kalender saat currentDate berubah
  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate, generateCalendarDays]); // ✅ generateCalendarDays dimasukkan karena stabil berkat useCallback

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="kalender-container">
      {/* Header */}
      <div className="kalender-header">
        <button type="button" className="nav-btn" onClick={goToPrevMonth} aria-label="Bulan Sebelumnya">
          ⬅️
        </button>

        <div className="month-display" onClick={openMonthPicker} role="button" tabIndex={0}>
          {bulanPanjang[currentMonth]} {currentYear}
        </div>

        <button type="button" className="nav-btn" onClick={goToNextMonth} aria-label="Bulan Berikutnya">
          ➡️
        </button>
      </div>

      {/* Month Picker */}
      {showMonthPicker && (
        <div className="month-picker-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="month-picker">
            <div className="year-input">
              <input
                type="number"
                value={tempYear}
                onChange={handleYearChange}
                onBlur={applyYear}
                onKeyPress={(e) => e.key === 'Enter' && applyYear()}
                min="1"
                max="9999"
                placeholder="Tahun"
                className="year-edit"
                aria-label="Input tahun"
              />
            </div>
            <div className="months-grid">
              {bulanNama.map((b, idx) => (
                <div
                  key={b}
                  className={`month-cell ${idx === currentMonth ? 'selected' : ''}`}
                  onClick={() => selectMonth(idx)}
                  role="button"
                  tabIndex={0}
                >
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header Hari */}
      <div className="hari-header">
        {hariNama.map((hari) => (
          <div key={hari} className={`hari-label ${hari === 'Min' ? 'sunday' : ''}`}>
            {hari}
          </div>
        ))}
      </div>

      {/* Grid Tanggal */}
      <div className="dates-grid">
        {daysInMonth.map((day, idx) => (
          <div
            key={idx}
            className={[
              'date-box',
              !day.isCurrentMonth && 'outside',
              day.dayOfWeek === 0 && 'sunday',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="date-number">{day.date}</span>
            {day.isCurrentMonth && <span className="weton">{day.weton}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kalender;
