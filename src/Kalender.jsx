// Kalender.jsx
import React, { useState, useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import './Kalender.css';

const Kalender = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const flatpickrRef = useRef(null);

  const handleTodayClick = () => {
    // Reset ke hari ini
    setSelectedDate(today);
    if (flatpickrRef.current) {
      flatpickrRef.current.flatpickr.setDate(today);
    }
  };

  const handleChange = (date) => {
    setSelectedDate(date[0]);
  };

  return (
    <div className="kalender-container">
      <h2>Kalender</h2>

      {/* Tombol Navigasi dan Tanggal */}
      <div className="date-nav">
        <button
          className="nav-btn"
          onClick={() => {
            const prevMonth = new Date(selectedDate);
            prevMonth.setMonth(prevMonth.getMonth() - 1);
            setSelectedDate(prevMonth);
            if (flatpickrRef.current) {
              flatpickrRef.current.flatpickr.setDate(prevMonth);
            }
          }}
        >
          ⬅️
        </button>

        <div className="current-date" onClick={() => flatpickrRef.current?.flatpickr.open()}>
          {selectedDate.getDate()} {new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(selectedDate)}
        </div>

        <button
          className="nav-btn"
          onClick={() => {
            const nextMonth = new Date(selectedDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            setSelectedDate(nextMonth);
            if (flatpickrRef.current) {
              flatpickrRef.current.flatpickr.setDate(nextMonth);
            }
          }}
        >
          ➡️
        </button>
      </div>

      {/* Tombol: Tampilkan Hari Ini */}
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <button onClick={handleTodayClick} className="today-btn">
          Tanggal Hari Ini
        </button>
      </div>

      {/* Flatpickr Inline (hanya muncul saat diklik) */}
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        <Flatpickr
          ref={flatpickrRef}
          options={{
            inline: true,
            dateFormat: 'd M Y',
            defaultDate: selectedDate,
            onChange: handleChange,
            onOpen: () => {
            },
            onClose: () => {
            },
          }}
          style={{ display: 'none' }} // Sembunyikan input asli
        />
      </div>
    </div>
  );
};

export default Kalender;
