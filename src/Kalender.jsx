// Kalender.jsx
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Default theme
import './Kalender.css'; // Custom styling

const Kalender = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);

  const hari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const formattedDate = `${selectedDate.getDate()} ${bulan[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
  };

  const goToToday = () => {
    const now = new Date();
    setSelectedDate(now);
    setShowCalendar(false);
  };

  return (
    <div className="kalender-container">
      <h2>Kalender</h2>

      {/* Tombol Navigasi: ⬅️ (Tgl Hari Ini) ➡️ */}
      <div className="navigation-bar">
        <button onClick={goToToday} className="btn-today">
          Hari Ini
        </button>
      </div>

      {/* Tombol Tanggal dengan Panah */}
      <div className="date-trigger" onClick={toggleCalendar}>
        <span className="arrow">⬅️</span>
        <span className="date-text">{formattedDate}</span>
        <span className="arrow">➡️</span>
      </div>

      {/* Flatpickr Calendar (muncul saat diklik) */}
      {showCalendar && (
        <div className="flatpickr-wrapper">
          <Flatpickr
            data-enable-time={false}
            dateFormat="d M Y"
            value={selectedDate}
            onChange={(dateArray) => {
              setSelectedDate(dateArray[0]);
              setShowCalendar(false); // Tutup setelah pilih
            }}
            options={{
              animate: true,
              allowInput: false,
              clickOpens: true,
              defaultDate: selectedDate,
            }}
            // Custom className untuk styling tanggal luar bulan
            className="flatpickr-input-hidden"
          />
        </div>
      )}

      {/* Tampilkan nama hari dan kalender mini (opsional) */}
      <div className="mini-calendar-header">
        {hari.map((h) => (
          <div key={h} className="hari-cell header">
            {h}
          </div>
        ))}
      </div>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        *Tanggal dari bulan lain lebih kecil (4pt lebih kecil dari default)
      </p>
    </div>
  );
};

export default Kalender;
