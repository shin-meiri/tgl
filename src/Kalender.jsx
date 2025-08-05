// Kalender.jsx
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import './Kalender.css';

const Kalender = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  const handleTodayClick = () => {
    setSelectedDate(today);
    // Opsional: scroll ke flatpickr jika terbuka
  };

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  return (
    <div className="kalender-container">
      <h2>Kalender</h2>

      {/* Tombol Navigasi: ⬅️ (Tgl Hari Ini) ➡️ */}
      <div className="nav-today">
        <button onClick={handlePrevMonth} className="nav-btn">
          ⬅️
        </button>

        <button onClick={handleTodayClick} className="today-btn">
          {today.getDate()}/{today.getMonth() + 1}/{today.getFullYear()}
        </button>

        <button onClick={handleNextMonth} className="nav-btn">
          ➡️
        </button>
      </div>

      {/* Flatpickr Inline - Hanya muncul saat diklik */}
      <div className="flatpickr-wrapper">
        <Flatpickr
          value={selectedDate}
          onChange={(dateArr) => setSelectedDate(dateArr[0])}
          options={{
            inline: true,
            defaultDate: selectedDate,
            onChange: () => {},
          }}
        />
      </div>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
        Bulan: <strong>{new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(selectedDate)}</strong>
      </p>
    </div>
  );
};

export default Kalender;
