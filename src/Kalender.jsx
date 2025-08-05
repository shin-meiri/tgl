// Kalender.jsx
import React, { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import axios from 'axios';
import './Kalender.css';

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const calendarRef = useRef(null);

  // Nama hari dan bulan dalam bahasa Indonesia
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Ambil data event dari API (contoh)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Contoh: API lokal atau eksternal
        const res = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5');
        const mockEvents = {};
        res.data.forEach((post, index) => {
          const date = new Date();
          date.setDate(10 + index); // acak tanggal 10-14
          const key = date.toISOString().split('T')[0];
          mockEvents[key] = post.title;
        });
        setEvents(mockEvents);
      } catch (err) {
        console.error('Gagal ambil data:', err);
      }
    };
    fetchEvents();
  }, []);

  // Inisialisasi flatpickr (untuk styling atau interaksi jika diperlukan)
  useEffect(() => {
    if (calendarRef.current) {
      flatpickr(calendarRef.current, {
        inline: true,
        onChange: (selectedDates) => {
          setCurrentDate(selectedDates[0] || new Date());
        },
        dateFormat: 'Y-m-d',
        disableMobile: true,
      });
    }
  }, []);

  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

    const rows = [];
    let cells = [];

    // Header hari
    days.forEach(day => {
      cells.push(
        <div key={`header-${day}`} className="calendar-header-day">
          {day}
        </div>
      );
    });
    rows.push(<div key="header" className="calendar-row">{cells}</div>);

    // Kosongkan awal bulan
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Isi tanggal
    for (let date = 1; date <= daysInMonth; date++) {
      const fullDate = new Date(year, month, date);
      const dateStr = fullDate.toISOString().split('T')[0];
      const isToday = isCurrentMonth && today.getDate() === date;

      cells.push(
        <div
          key={date}
          className={`calendar-day ${isToday ? 'today' : ''} ${events[dateStr] ? 'has-event' : ''}`}
        >
          <span className="date-number">{date}</span>
          {events[dateStr] && <div className="event-dot"></div>}
        </div>
      );
    }

    rows.push(<div key="days" className="calendar-row">{cells}</div>);
    return rows;
  };

  const displayMonthYear = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={goToPreviousMonth} className="nav-btn prev">
          ⬅️
        </button>
        <h2 className="month-display">{displayMonthYear}</h2>
        <button onClick={goToNextMonth} className="nav-btn next">
          ➡️
        </button>
      </div>

      <div className="calendar-body">
        {renderCalendar()}
      </div>

      {/* Optional: Flatpickr inline (bisa di-hide jika tidak perlu) */}
      <input
        ref={calendarRef}
        type="text"
        style={{ display: 'none' }}
        value={currentDate.toISOString().split('T')[0]}
        readOnly
      />

      {/* Legend Event */}
      <div className="legend">
        <div className="legend-item">
          <div className="event-dot"></div>
          <span>Ada Event</span>
        </div>
      </div>
    </div>
  );
};

export default Kalender;
