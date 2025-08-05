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

  // Nama hari & bulan
  const hariNama = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const hariPanjang = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const pasaran = ['Pon', 'Wage', 'Kliwon', 'Legi', 'Pahing'];
  const bulanNama = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const bulanPanjang = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // ⚙️ Fungsi: Hitung Weton Jawa (Hari + Pasaran)
  const getWeton = (date) => {
    const dayOfWeek = date.getDay();
    const hari = hariPanjang[dayOfWeek];

    // Acuan: 22 Januari 2025 = Selasa Kliwon
    const anchor = new Date('2025-01-22'); // Selasa Kliwon (pasaran index 2)
    const diffTime = date - anchor;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const pasaranIndex = (2 + diffDays) % 5;
    const adjustedIndex = (pasaranIndex + 5) % 5; // pastikan positif
    const pasaranHari = pasaran[adjustedIndex];

    return `${hari} ${pasaranHari}`;
  };

  // 🧮 Generate semua sel kalender (termasuk hari dari bulan sebelum/sesudah)
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
    const daysCount = new Date(year, month + 1, 0).getDate(); // jumlah hari
    const days = [];

    // Tanggal dari bulan lalu
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        dayOfWeek: d.getDay(),
        weton: getWeton(d),
      });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysCount; day++) {
      const d = new Date(year, month, day);
      days.push({
        date: day,
        isCurrentMonth: true,
        dayOfWeek: d.getDay(),
        weton: getWeton(d),
      });
    }

    // Tanggal dari bulan depan (isi grid sampai 42 sel = 6 baris)
    const totalCells = days.length;
    const remaining = 42 - totalCells;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      days.push({
        date: day,
        isCurrentMonth: false,
        dayOfWeek: d.getDay(),
        weton: getWeton(d),
      });
    }

    setDaysInMonth(days);
  };

  // ⬅️ Navigasi bulan sebelumnya
  const prevMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  // ➡️ Navigasi bulan berikutnya
  const nextMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  // 🔽 Buka picker bulan & tahun
  const openMonthPicker = () => {
    setTempYear(currentDate.getFullYear());
    setShowMonthPicker(true);
  };

  // ✅ Pilih bulan dari grid
  const selectMonth = (monthIndex) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(monthIndex);
      d.setFullYear(tempYear || d.getFullYear());
      return d;
    });
    setShowMonthPicker(false);
  };

  // 🖊️ Input tahun
  const handleYearChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setTempYear(value === '' ? '' : parseInt(value, 10));
    }
  };

  // ✔️ Terapkan tahun saat blur/enter
  const applyYear = () => {
    if (tempYear) {
      setCurrentDate(prev => {
        const d = new Date(prev);
        d.setFullYear(tempYear);
        return d;
      });
    }
  };

  // 🔁 Tutup picker saat klik luar
  useEffect(() => {
    const closePicker = () => setShowMonthPicker(false);
    if (showMonthPicker) {
      document.addEventListener('click', closePicker);
      return () => document.removeEventListener('click', closePicker);
    }
  }, [showMonthPicker]);

  // 📡 Simulasi API call (misal: muat acara)
  useEffect(() => {
    setLoading(true);
    axios
      .get('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then(res => console.log('Data dari API:', res.data))
      .catch(err => console.error('Error API:', err))
      .finally(() => setLoading(false));
  }, [currentDate]);

  // 🔁 Generate kalender saat currentDate berubah
  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="kalender-container">
      {/* Header: Navigasi & Bulan-Tahun */}
      <div className="kalender-header">
        <button className="nav-btn" onClick={prevMonth} aria-label="Bulan Sebelumnya">
          ⬅️
        </button>

        <div
          className="month-display"
          onClick={(e) => {
            e.stopPropagation();
            openMonthPicker();
          }}
        >
          {bulanPanjang[currentMonth]} {currentYear}
        </div>

        <button className="nav-btn" onClick={nextMonth} aria-label="Bulan Berikutnya">
          ➡️
        </button>
      </div>

      {/* Picker Bulan & Tahun (seperti Excel) */}
      {showMonthPicker && (
        <div className="month-picker-overlay" onClick={e => e.stopPropagation()}>
          <div className="month-picker">
            <div className="year-input">
              <input
                type="number"
                value={tempYear}
                onChange={handleYearChange}
                onBlur={applyYear}
                onKeyPress={e => e.key === 'Enter' && applyYear()}
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

      {/* Header Hari (Minggu - Sabtu) */}
      <div className="hari-header">
        {hariNama.map(hari => (
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
            title={dayObj.weton} // Tooltip: "Senin Kliwon"
          >
            <span className="date-number">{dayObj.date}</span>
            <span className="weton">{dayObj.weton.split(' ')[1]}</span>
          </div>
        ))}
      </div>

      {loading && <div className="loading">Memuat data...</div>}
    </div>
  );
};

export default Kalender;
