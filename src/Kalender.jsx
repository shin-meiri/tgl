// Kalender.jsx
import React, { useState, useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import './Kalender.css';

const Kalender = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);
  const flatpickrRef = useRef(null);

  const hari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Dapatkan semua tanggal dalam grid bulan (termasuk overflow minggu)
  const getCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tanggal dari bulan sebelumnya (untuk melengkapi minggu pertama)
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: prevMonthLastDay - i, isCurrentMonth: false });
    }

    // Tanggal bulan ini
    for (let date = 1; date <= totalDays; date++) {
      days.push({ date, isCurrentMonth: true });
    }

    // Tanggal dari bulan depan (untuk lengkapi minggu terakhir)
    const remaining = 42 - days.length; // 6 baris x 7 kolom
    for (let date = 1; date <= remaining; date++) {
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = getCalendarDays(selectedDate);
  const currentMonthName = bulan[selectedDate.getMonth()];
  const currentYear = selectedDate.getFullYear();

  const handleTodayClick = () => {
    setSelectedDate(today);
    setShowCalendar(false);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  const onDateChange = (selectedDates) => {
    if (selectedDates.length > 0) {
      setSelectedDate(selectedDates[0]);
    }
    setShowCalendar(false);
  };

  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
    if (!showCalendar && flatpickrRef.current) {
      flatpickrRef.current.flatpickr.open();
    }
  };

  return (
    <div className="kalender-container">
      <h2>Kalender</h2>

      {/* Tombol Navigasi */}
      <div className="navigation">
        <button onClick={handlePrevMonth} className="nav-btn">
          ⬅️
        </button>

        <button onClick={toggleCalendar} className="today-btn">
          {selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
        </button>

        <button onClick={handleNextMonth} className="nav-btn">
          ➡️
        </button>
      </div>

      {/* Flatpickr untuk pilih tanggal (hanya muncul saat diklik) */}
      <div style={{ position: 'relative' }}>
        <Flatpickr
          ref={flatpickrRef}
          options={{
            inline: true,
            onChange: onDateChange,
            defaultDate: selectedDate,
          }}
          style={{ display: showCalendar ? 'block' : 'none' }}
        />
      </div>

      {/* Header Hari */}
      <div className="hari-header">
        {hari.map((nama) => (
          <div key={nama} className="hari-cell">
            {nama}
          </div>
        ))}
      </div>

      {/* Grid Kalender */}
      <div className="kalender-grid">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`kalender-date ${day.isCurrentMonth ? 'current' : 'other'}`}
          >
            {day.date}
          </div>
        ))}
      </div>

      <p className="month-label">
        <strong>{currentMonthName} {currentYear}</strong>
      </p>
    </div>
  );
};

export default Kalender;
