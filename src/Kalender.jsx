// Kalender.jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Kalender.css';

const Kalender = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [isOpen, setIsOpen] = useState(false);

  const hari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']; // Singkatan
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsOpen(false); // Tutup setelah pilih
  };

  const formatDate = (date) => {
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Dapatkan semua tanggal dalam grid (termasuk akhir bulan lalu & awal bulan depan)
  const getCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
    const lastDayPrevMonth = new Date(year, month, 0).getDate();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tanggal akhir bulan lalu (untuk grid)
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: lastDayPrevMonth - i, isCurrentMonth: false });
    }

    // Tanggal bulan ini
    for (let date = 1; date <= totalDays; date++) {
      days.push({ date, isCurrentMonth: true });
    }

    // Lengkapi grid (7x6 = 42 cell)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: i, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = getCalendarDays(selectedDate);
  const currentMonthName = bulan[selectedDate.getMonth()];
  const currentYear = selectedDate.getFullYear();

  return (
    <div className="kalender-container">
      <h2>Kalender</h2>

      {/* Tombol Navigasi dan Dropdown */}
      <div className="datepicker-dropdown">
        <button onClick={handlePrevMonth} className="nav-btn">
          ⬅️
        </button>

        <div className="datepicker-wrapper">
          <button
            className="date-display-btn"
            onClick={() => setIsOpen(!isOpen)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Tutup saat klik luar
          >
            {formatDate(selectedDate)}
          </button>

          {isOpen && (
            <div className="datepicker-popup">
              <DatePicker
                inline
                selected={selectedDate}
                onChange={handleDateChange}
                onCalendarClose={() => setIsOpen(false)}
                onCalendarOpen={() => setIsOpen(true)}
              />
            </div>
          )}
        </div>

        <button onClick={handleNextMonth} className="nav-btn">
          ➡️
        </button>
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
            className={`kalender-date ${
              day.isCurrentMonth ? 'current' : 'other-month'
            } ${
              selectedDate.getDate() === day.date &&
              selectedDate.getMonth() === selectedDate.getMonth() &&
              selectedDate.getFullYear() === currentYear &&
              day.isCurrentMonth
                ? 'selected'
                : ''
            }`}
          >
            {day.date}
          </div>
        ))}
      </div>

      <p className="month-info">
        Bulan: <strong>{currentMonthName} {currentYear}</strong>
      </p>
    </div>
  );
};

export default Kalender;
