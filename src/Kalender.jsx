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

  // Pasaran Jawa (5 hari)
  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  // Weton lengkap (gabungan hari + pasaran)
  const wetonNama = {
    'Minggu_Legi': 'Wage',
    'Senin_Legi': 'Keliwon',
    'Selasa_Legi': 'Legi',
    'Rabu_Legi': 'Pahing',
    'Kamis_Legi': 'Pon',
    'Jumat_Legi': 'Wage',
    'Sabtu_Legi': 'Kliwon',

    'Minggu_Pahing': 'Pahing',
    'Senin_Pahing': 'Pon',
    'Selasa_Pahing': 'Wage',
    'Rabu_Pahing': 'Kliwon',
    'Kamis_Pahing': 'Legi',
    'Jumat_Pahing': 'Pahing',
    'Sabtu_Pahing': 'Pon',

    'Minggu_Pon': 'Pon',
    'Senin_Pon': 'Wage',
    'Selasa_Pon': 'Kliwon',
    'Rabu_Pon': 'Legi',
    'Kamis_Pon': 'Pahing',
    'Jumat_Pon': 'Pon',
    'Sabtu_Pon': 'Wage',

    'Minggu_Wage': 'Wage',
    'Senin_Wage': 'Kliwon',
    'Selasa_Wage': 'Legi',
    'Rabu_Wage': 'Pahing',
    'Kamis_Wage': 'Pon',
    'Jumat_Wage': 'Wage',
    'Sabtu_Wage': 'Kliwon',

    'Minggu_Kliwon': 'Kliwon',
    'Senin_Kliwon': 'Legi',
    'Selasa_Kliwon': 'Pahing',
    'Rabu_Kliwon': 'Pon',
    'Kamis_Kliwon': 'Wage',
    'Jumat_Kliwon': 'Kliwon',
    'Sabtu_Kliwon': 'Legi'
  };

  // Fungsi hitung pasaran (Neptu 5)
  const getPasaran = (date) => {
    const time = date.getTime();
    const epoch = new Date('2024-03-24'); // Contoh: 24 Maret 2024 = Legi
    const diffTime = time - epoch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const index = diffDays % 5;
    return pasaran[index >= 0 ? index : index + 5];
  };

  // Hitung nama weton
  const getWeton = (date) => {
    const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()];
    const pasaranName = getPasaran(date);
    return wetonNama[`${dayName}_${pasaranName}`] || pasaranName;
  };

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tanggal dari bulan sebelumnya
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        dayOfWeek: d.getDay(),
        pasaran: getPasaran(d),
        weton: getWeton(d)
      });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysCount; day++) {
      const d = new Date(year, month, day);
      days.push({
        date: day,
        isCurrentMonth: true,
        dayOfWeek: d.getDay(),
        pasaran: getPasaran(d),
        weton: getWeton(d)
      });
    }

    // Tanggal dari bulan depan
    const total = days.length;
    const remaining = 42 - total; // 6 baris x 7
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      days.push({
        date: day,
        isCurrentMonth: false,
        dayOfWeek: d.getDay(),
        pasaran: getPasaran(d),
        weton: getWeton(d)
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
      setTempYear(value ? parseInt(value, 10) : '');
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
      .get('https://jsonplaceholder.typicode.com/posts', { params: { _limit: 1 } })
      .catch(err => console.warn('API gagal:', err))
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
                value={tempYear || ''}
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
              {bulanNama.map((b, idx) => (
                <div
                  key={b}
                  className={`month-cell ${idx === currentMonth ? 'selected' : ''}`}
                  onClick={() => selectMonth(idx)}
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

      {/* Grid Tanggal + Weton */}
      <div className="dates-grid">
        {daysInMonth.map((day, idx) => (
          <div
            key={idx}
            className={`date-box
              ${!day.isCurrentMonth ? 'outside' : ''}
              ${day.dayOfWeek === 0 ? 'sunday' : ''}
            `}
          >
            <span className="date-number">{day.date}</span>
            <span className="weton">{day.pasaran}</span>
          </div>
        ))}
      </div>

      {loading && <div className="loading">Memuat...</div>}
    </div>
  );
};

export default Kalender;
