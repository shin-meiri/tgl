// Kalender.jsx
import React, { useEffect, useRef, useState } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Import default CSS dari flatpickr
import axios from 'axios';
import './Kalender.css';

const Kalender = () => {
  const calendarRef = useRef(null);
  const flatpickrInstance = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  // Format tanggal sebagai "M/D/YYYY"
  const formatDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // Ambil data dari API (contoh dummy)
  const fetchData = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    axios
      .get(`https://jsonplaceholder.typicode.com/posts?date=${formattedDate}`)
      .then((res) => {
        setEvents(res.data.slice(0, 3)); // ambil 3 contoh data
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setEvents([]);
      });
  };

  useEffect(() => {
    // Inisialisasi Flatpickr
    flatpickrInstance.current = flatpickr(calendarRef.current, {
      inline: true,
      onChange: (selectedDates) => {
        setCurrentDate(selectedDates[0]);
        fetchData(selectedDates[0]);
      },
      defaultDate: currentDate,
    });

    // Load data awal
    fetchData(currentDate);

    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
  }, []);

  // Navigasi ke bulan sebelumnya
  const goToPrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    flatpickrInstance.current?.jumpToDate(newDate);
    setCurrentDate(newDate);
    fetchData(newDate);
  };

  // Navigasi ke bulan berikutnya
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    flatpickrInstance.current?.jumpToDate(newDate);
    setCurrentDate(newDate);
    fetchData(newDate);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-button prev" onClick={goToPrevMonth}>
          ⬅️
        </button>
        <span className="current-date-display">
          {formatDate(currentDate)}
        </span>
        <button className="nav-button next" onClick={goToNextMonth}>
          ➡️
        </button>
      </div>

      <div className="calendar-body">
        <div ref={calendarRef}></div>
      </div>

      <div className="event-list">
        <h4>Events on {formatDate(currentDate)}:</h4>
        {events.length > 0 ? (
          <ul>
            {events.map((event, index) => (
              <li key={index}>Post ID: {event.id}</li>
            ))}
          </ul>
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
};

export default Kalender;
