// Kalender.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import 'flatpickr/dist/flatpickr.min.css';
import './Kalender.css';

// ✅ Dipindahkan keluar dari komponen agar tidak berubah tiap render
const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

const WETON_NAMA = {
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

  // ✅ getPasaran: tidak bergantung pada state, jadi aman
  const getPasaran = useCallback((date) => {
    const epoch = new Date('2024-03-24'); // Legi
    const diffTime = date.getTime() - epoch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const index = diffDays % 5;
    return PASARAN[(index % 5 + 5) % 5];
  }, []); // ✅ Tidak ada dependency → stabil

  // ✅ getWeton: hanya bergantung pada getPasaran + konstanta
  const getWeton = useCallback((date) => {
    const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()];
    const pasaranName = getPasaran(date);
    return WETON_NAMA[`${dayName}_${pasaranName}`] || pasaranName;
  }, [getPasaran]); // ✅ Hanya getPasaran yang bisa berubah (tapi tidak akan)

  // ✅ generateCalendarDays: bergantung pada getPasaran & getWeton
  const generateCalendarDays = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Bulan sebelumnya
    const prevLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevLastDay - i);
      days.push({
        date: prevLastDay - i,
        isCurrentMonth: false,
        dayOfWeek: d.getDay(),
        pasaran: getPasaran(d),
        weton: getWeton(d)
      });
    }

    // Bulan ini
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

    // Bulan depan (isi hingga 42 sel)
    const total = days.length;
    const remaining = 42 - total;
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
  }, [getPasaran, getWeton]);

  // Navigasi
  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const openMonthPicker = () => {
    setTempYear(currentDate.getFullYear());
    setShowMonthPicker(true);
  };

  const selectMonth = (monthIndex) => {
    setCurrentDate(new Date(tempYear || currentDate.getFullYear(), monthIndex));
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
      setCurrentDate(prev => new Date(tempYear, prev.getMonth()));
    }
  };

  // Simulasi API
  useEffect(() => {
    setLoading(true);
    axios.get('https://jsonplaceholder.typicode.com/posts', { params: { _limit: 1 } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentDate]);

  // Generate kalender
  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate, generateCalendarDays]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="kalender-container">
      {/* Header */}
      <div className="kalender-header">
        <button className="nav-btn" onClick={prevMonth} aria-label="Prev">{`⬅️`}</button>
        <div className="month-display" onClick={openMonthPicker}>
          {bulanPanjang[currentMonth]} {currentYear}
        </div>
        <button className="nav-btn" onClick={nextMonth} aria-label="Next">{`➡️`}</button>
      </div>

      {/* Month Picker */}
      {showMonthPicker && (
        <div className="month-picker-overlay">
          <div className="month-picker">
            <div className="year-input">
              <input
                type="number"
                value={tempYear || ''}
                onChange={handleYearChange}
                onBlur={applyYear}
                onKeyPress={e => e.key === 'Enter' && applyYear()}
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

      {/* Hari */}
      <div className="hari-header">
        {hariNama.map(h => (
          <div key={h} className={`hari-label ${h === 'Min' ? 'sunday' : ''}`}>{h}</div>
        ))}
      </div>

      {/* Tanggal + Weton */}
      <div className="dates-grid">
        {daysInMonth.map((d, i) => (
          <div key={i} className={`date-box ${!d.isCurrentMonth ? 'outside' : ''} ${d.dayOfWeek === 0 ? 'sunday' : ''}`}>
            <span className="date-number">{d.date}</span>
            <span className="weton">{d.pasaran}</span>
          </div>
        ))}
      </div>

      {loading && <div className="loading">Memuat...</div>}
    </div>
  );
};

export default Kalender;
