// Kalender.jsx
import React, { useState, useRef, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import './Kalender.css';

const Kalender = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const hari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
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

  const handleDateChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  const formatDate = (date) => {
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Dapatkan semua tanggal dalam grid
  const getCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
    const lastDayPrevMonth = new Date(year, month, 0).getDate();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tanggal akhir bulan lalu
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: lastDayPrevMonth - i, isCurrentMonth: false });
    }

    // Tanggal bulan ini
    for (let d = 1; d <= totalDays; d++) {
      days.push({ date: d, isCurrentMonth: true });
    }

    // Tanggal awal bulan depan
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: i, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = getCalendarDays(selectedDate);
  const currentMonthName = bulan[selectedDate.getMonth()];
  const currentYearDisplay = selectedDate.getFullYear();

  // Close flatpickr jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="kalender-container" ref={wrapperRef}>
      <h2>Kalender</h2>

      {/* Navigasi dan Flatpickr */}
      <div className="datepicker-dropdown">
        <button onClick={handlePrevMonth} className="nav-btn">
          ⬅️
        </button>

        <div className="datepicker-wrapper">
          <Flatpickr
            value={selectedDate}
            onChange={handleDateChange}
            options={{
              dateFormat: 'd F Y',
              altInput: true,
              altFormat: 'j F Y',
              allowInput: false,
              clickOpens: true,
              animate: true,
              minDate: '1900-01-01',
              maxDate: '3000-12-31',
              // 🔥 Aktifkan dropdown bulan & tahun
              monthSelectorType: 'dropdown',
              yearSelectorType: 'dropdown',
              showMonths: 1,
              // 🔥 Scrollable dropdown
              yearDropdownItemNumber: 15,
              scrollableYear: true,
              scrollableMonth: true,
              // Tampilkan "Today" button
              // showMonths: 1,
            }}
            render={({ value, ...props }, ref) => {
              return (
                <input
                  ref={ref}
                  className="date-display-btn"
                  value={formatDate(selectedDate)}
                  readOnly
                  onClick={() => setIsOpen(!isOpen)}
                />
              );
            }}
          />
        </div>

        <button onClick={handleNextMonth} className="nav-btn">
          ➡️
        </button>
      </div>

      {/* Header Hari */}
      <div className="hari-header">
        {hari.map((nama) => (
          <div key={nama} className="hari-cell header">
            {nama}
          </div>
        ))}
      </div>

      {/* Grid Kalender */}
      <div className="kalender-grid">
        {calendarDays.map((day, index) => {
          // ✅ Perbaiki: Bandingkan dengan `today` asli
          const isToday =
            day.isCurrentMonth &&
            day.date === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear();

          const isSelected =
            day.isCurrentMonth && day.date === selectedDate.getDate();

          return (
            <div
              key={index}
              className={`kalender-date ${
                day.isCurrentMonth ? 'current' : 'other-month'
              } ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
            >
              {day.date}
            </div>
          );
        })}
      </div>

      <p className="month-info">
        Bulan: <strong>{currentMonthName} {currentYearDisplay}</strong>
      </p>
    </div>
  );
};

export default Kalender;
