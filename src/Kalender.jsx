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

  const formattedDate = `${selectedDate.getDate()} ${bulan[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  // Buka date picker
  const openDatePicker = () => {
    if (flatpickrRef.current) {
      flatpickrRef.current.flatpickr.open();
    }
  };

  // Saat tanggal dipilih
  const handleDateChange = (dateArray) => {
    setSelectedDate(new Date(dateArray[0]));
    setShowCalendar(true);
  };

  // Navigasi ke hari sebelumnya
  const prevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    setShowCalendar(true);
  };

  // Navigasi ke hari berikutnya
  const nextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    setShowCalendar(true);
  };

  // Dapatkan semua tanggal dalam bulan
  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tambahkan tanggal dari bulan sebelumnya
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: prevMonthLastDay - i, isOutside: true });
    }

    // Tambahkan tanggal bulan ini
    for (let date = 1; date <= totalDays; date++) {
      days.push({ date, isOutside: false });
    }

    // Tambahkan tanggal dari bulan depan
    const remainingCells = 42 - days.length; // 6 baris x 7 kolom
    for (let date = 1; date <= remainingCells; date++) {
      days.push({ date, isOutside: true });
    }

    return days;
  };

  const daysInMonth = getDaysInMonth();
  const currentMonthName = bulan[selectedDate.getMonth()];
  const currentYear = selectedDate.getFullYear();

  const isToday = (dayObj) => {
    const today = new Date();
    return (
      !dayObj.isOutside &&
      dayObj.date === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="kalender-container">
      <h2>Kalender</h2>

      {/* Tombol Navigasi */}
      <div className="navigation">
        <button onClick={prevDay} className="nav-btn">
          ⬅️
        </button>

        <div className="current-date" onClick={openDatePicker}>
          {formattedDate}
        </div>

        <button onClick={nextDay} className="nav-btn">
          ➡️
        </button>
      </div>

      {/* Flatpickr (hidden sampai diklik) */}
      <Flatpickr
        ref={flatpickrRef}
        options={{
          inline: true,
          dateFormat: 'Y-m-d',
          onChange: handleDateChange,
          defaultDate: selectedDate,
        }}
        style={{ display: showCalendar ? 'block' : 'none' }}
      />

      {/* Tampilkan Kalender Bulan */}
      {showCalendar && (
        <div className="bulan-kalender">
          <h3>{currentMonthName} {currentYear}</h3>
          <div className="hari-header">
            {hari.map((h) => (
              <div key={h} className="hari-cell">
                {h}
              </div>
            ))}
          </div>

          <div className="kalender-grid">
            {daysInMonth.map((day, index) => (
              <div
                key={index}
                className={`kalender-date ${day.isOutside ? 'outside' : ''} ${isToday(day) ? 'today' : ''}`}
              >
                {day.date}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Kalender;
