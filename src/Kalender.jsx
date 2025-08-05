// Kalender.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import './Kalender.css';

const Kalender = () => {
  const [date, setDate] = useState(new Date('2025-08-05')); // Tanggal awal: 5 Agustus 2025
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const calendarRef = useRef(null);

  // Format tanggal ke DD/MM/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // Ambil data acara berdasarkan tanggal
  const fetchEvents = async (selectedDate) => {
    setLoading(true);
    try {
      // Contoh API: /api/events?date=2025-08-05
      const response = await axios.get('/api/events', {
        params: { date: selectedDate.toISOString().split('T')[0] },
      });
      setEvents(response.data || []);
    } catch (error) {
      console.error('Gagal memuat acara:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Inisialisasi Flatpickr
  useEffect(() => {
    const fp = flatpickr(calendarRef.current, {
      inline: true,
      dateFormat: 'Y-m-d',
      defaultDate: date,
      onChange: (selectedDates) => {
        setDate(selectedDates[0]);
      },
    });

    return () => fp.destroy();
  }, []);

  // Muat acara saat tanggal berubah
  useEffect(() => {
    fetchEvents(date);
  }, [date]);

  // Fungsi navigasi
  const goToPrevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  return (
    <div className="kalender-container">
      <div className="calendar-header">
        <button onClick={goToPrevDay} className="nav-btn prev-btn">
          ⬅️
        </button>
        <h2>{formatDate(date)}</h2>
        <button onClick={goToNextDay} className="nav-btn next-btn">
          ➡️
        </button>
      </div>

      <div className="calendar-body">
        <input
          type="text"
          ref={calendarRef}
          style={{ opacity: 0, height: 0, position: 'absolute' }}
        />
      </div>

      <div className="events-section">
        <h3>Acara pada {formatDate(date)}</h3>
        {loading ? (
          <p>Loading...</p>
        ) : events.length > 0 ? (
          <ul>
            {events.map((event, index) => (
              <li key={index}>{event.title}</li>
            ))}
          </ul>
        ) : (
          <p>Tidak ada acara.</p>
        )}
      </div>
    </div>
  );
};

export default Kalender;
