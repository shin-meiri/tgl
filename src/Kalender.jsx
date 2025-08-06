// Kalender.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'flatpickr/dist/flatpickr.min.css';
import './Kalender.css';

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [loading, setLoading] = useState(false);

  const hariNama = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const bulanNama = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const bulanPanjang = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

  // Titik acuan: 1 Januari 1900 adalah Legi (bisa disesuaikan, ini pendekatan umum)
  const EPOCH_DATE = new Date(1899, 11, 31); // 31 Des 1899 → hari sebelum 1 Jan 1900
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  // Fungsi hitung weton berdasarkan tanggal
  const getWeton = (date) => {
    const diffTime = Math.abs(date - EPOCH_DATE);
    const diffDays = Math.floor(diffTime / MS_PER_DAY);
    const pasaranIndex = diffDays % 5;
    return pasaran[pasaranIndex];
  };

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tanggal dari bulan lalu
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.unshift({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        dayOfWeek: (6 - i) % 7,
        weton: null,
      });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysCount; day++) {
      const currentDateObj = new Date(year, month, day);
      const dayOfWeek = currentDateObj.getDay();
      days.push({
        date: day,
        isCurrentMonth: true,
        dayOfWeek,
        weton: getWeton(currentDateObj),
      });
    }

    // Tanggal dari bulan depan (untuk lengkapi grid)
    const totalCells = days.length;
    const remaining = 42 - totalCells; // 6 baris
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
  };

  const prevMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const nextMonth = () => {
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
      setTempYear(value === '' ? '' : parseInt(value, 10));
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

  useEffect(() => {
    setLoading(true);
    axios
      .get('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then(res => console.log('Data loaded:', res.data))
      .catch(err => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, [currentDate]);

  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="kalender-container">
      {/* Header navigasi */}
      <div className="kalender-header">
        <button className="nav-btn" onClick={prevMonth} aria-label="Bulan Sebelumnya">
          ⬅️
        </button>

        <div className="month-display" onClick={openMonthPicker} aria-label="Pilih bulan dan tahun">
          {bulanPanjang[currentMonth]} {currentYear}
        </div>

        <button className="nav-btn" onClick={nextMonth} aria-label="Bulan Berikutnya">
          ➡️
        </button>
      </div>

      {/* Picker Bulan & Tahun */}
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
              />
            </div>

            <div className="months-grid">
              {bulanNama.map((bulan, index) => (
                <div
                  key={bulan}
                  className={`month-cell ${index === currentMonth ? 'selected' : ''}`}
                  onClick={() => selectMonth(index)}
                >
                  {bulan}
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

      {/* Grid Tanggal + Weton */}
      <div className="dates-grid">
        {daysInMonth.map((dayObj, index) => (
          <div
            key={index}
            className={`date-box
              ${!dayObj.isCurrentMonth ? 'outside' : ''}
              ${dayObj.dayOfWeek === 0 ? 'sunday' : ''}
            `}
          >
            <span className="date-number">{dayObj.date}</span>
            {dayObj.isCurrentMonth && (
              <span className="weton">{dayObj.weton}</span>
            )}
          </div>
        ))}
      </div>

      {loading && <div className="loading">Memuat...</div>}
    </div>
  );
};

export default Kalender;
