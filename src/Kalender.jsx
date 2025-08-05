// Kalender.jsx
import React, { useState, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import './Kalender.css';

// Bahasa Indonesia
import id from 'flatpickr/dist/l10n/id.js';

flatpickr.localize(id.id); // Set ke Bahasa Indonesia

const Kalender = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const flatpickrRef = useRef(null);

  const hari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Buka flatpickr secara manual
  const openDatePicker = () => {
    flatpickrRef.current.flatpickr.open();
  };

  // Handle perubahan tanggal
  const handleDateChange = (selectedDates) => {
    if (selectedDates.length > 0) {
      setSelectedDate(new Date(selectedDates[0]));
    }
  };

  // Dapatkan semua tanggal dalam grid (termasuk akhir bulan lalu & awal bulan depan)
  const getCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tanggal dari akhir bulan lalu
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: prevMonthLastDay - i, isCurrentMonth: false });
    }

    // Tanggal bulan ini
    for (let date = 1; date <= totalDays; date++) {
      days.push({ date, isCurrentMonth: true });
    }

    // Isi sisa grid (7x6 = 42 cell max)
    const remaining = 42 - days.length;
    for (let date = 1; date <= remaining; date++) {
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = getCalendarDays(selectedDate);
  const currentMonthName = bulan[selectedDate.getMonth()];
  const currentYear = selectedDate.getFullYear();

  return (
    <div className="kalender-container">
      <h2>Kalender</h2>

      {/* Navigasi: ⬅️ (Tanggal Hari Ini) ➡️ */}
      <div className="navigation-row">
        <button onClick={() => {
          const newDate = new Date(selectedDate);
          newDate.setMonth(newDate.getMonth() - 1);
          setSelectedDate(newDate);
        }} className="nav-btn">
          ⬅️
        </button>

        <div onClick={openDatePicker} className="current-date-display">
          {selectedDate.getDate()} {currentMonthName} {currentYear}
        </div>

        <button onClick={() => {
          const newDate = new Date(selectedDate);
          newDate.setMonth(newDate.getMonth() + 1);
          setSelectedDate(newDate);
        }} className="nav-btn">
          ➡️
        </button>
      </div>

      {/* Flatpickr - Tersembunyi, hanya muncul saat diklik */}
      <div style={{ position: 'relative', display: 'none' }}>
        <flatpickr
          ref={flatpickrRef}
          options={{
            inline: true,
            onChange: handleDateChange,
            defaultDate: selectedDate,
            animate: true,
          }}
        />
      </div>

      {/* Nama Hari */}
      <div className="hari-header">
        {hari.map((nama) => (
          <div key={nama} className="hari-cell header">
            {nama}
          </div>
        ))}
      </div>

      {/* Grid Kalender */}
      <div className="kalender-grid">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`kalender-date ${!day.isCurrentMonth ? 'other-month' : ''} ${
              selectedDate.getDate() === day.date &&
              selectedDate.getMonth() === selectedDate.getMonth() &&
              selectedDate.getFullYear() === selectedDate.getFullYear()
                ? 'selected'
                : ''
            }`}
          >
            {day.date}
          </div>
        ))}
      </div>

      <p style={{ marginTop: '15px', fontSize: '14px', color: '#555', textAlign: 'center' }}>
        Bulan: <strong>{currentMonthName} {currentYear}</strong>
      </p>
    </div>
  );
};

export default Kalender;
