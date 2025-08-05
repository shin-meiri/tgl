// Kalender.jsx
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import './Kalender.css';

const Kalender = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

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

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  const formatDay = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    // Cek apakah tanggal termasuk di bulan saat ini
    const isCurrentMonth = month === selectedMonth && date.getFullYear() === selectedYear;

    return (
      <span
        style={{
          fontSize: isCurrentMonth ? '14px' : '12px', // ukuran lebih kecil untuk luar bulan
          opacity: isCurrentMonth ? 1 : 0.6,
          color: isCurrentMonth ? '#333' : '#999',
        }}
      >
        {day}
      </span>
    );
  };

  return (
    <div className="kalender-container">
      <h2>Kalender</h2>

      {/* Tombol Navigasi */}
      <div className="navigation">
        <button onClick={handlePrevMonth} className="nav-btn">
          ⬅️
        </button>

        <Flatpickr
          value={selectedDate}
          options={{
            dateFormat: 'd/m/Y',
            onChange: (selectedDates) => setSelectedDate(new Date(selectedDates[0])),
            showMonths: 1,
            disableMobile: true,
          }}
          render={({ defaultValue, value, ...props }, ref) => {
            return (
              <button {...props} ref={ref} className="today-btn" onClick={handleTodayClick}>
                {value || defaultValue}
              </button>
            );
          }}
        />

        <button onClick={handleNextMonth} className="nav-btn">
          ➡️
        </button>
      </div>

      {/* Kalender Grid */}
      <div className="kalender-grid">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((hari) => (
          <div key={hari} className="hari-header">
            {hari}
          </div>
        ))}

        {(() => {
          const year = selectedDate.getFullYear();
          const month = selectedDate.getMonth();
          const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
          const totalDays = new Date(year, month + 1, 0).getDate();

          const days = [];

          // Tanggal dari bulan sebelumnya
          const prevMonthLastDay = new Date(year, month, 0).getDate();
          for (let i = firstDay - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, prevMonthLastDay - i);
            days.push(
              <div key={`prev-${i}`} className="kalender-date other-month">
                {formatDay(date)}
              </div>
            );
          }

          // Tanggal bulan ini
          for (let date = 1; date <= totalDays; date++) {
            const currentDate = new Date(year, month, date);
            const isToday =
              today.getDate() === date &&
              today.getMonth() === month &&
              today.getFullYear() === year;

            days.push(
              <div
                key={date}
                className={`kalender-date ${isToday ? 'today' : ''}`}
              >
                {formatDay(currentDate)}
              </div>
            );
          }

          // Tanggal dari bulan depan
          const remaining = 42 - days.length; // 6 baris x 7 kolom
          for (let i = 1; i <= remaining; i++) {
            const date = new Date(year, month + 1, i);
            days.push(
              <div key={`next-${i}`} className="kalender-date other-month">
                {formatDay(date)}
              </div>
            );
          }

          return days;
        })()}
      </div>
    </div>
  );
};

export default Kalender;
