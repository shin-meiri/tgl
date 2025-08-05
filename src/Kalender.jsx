// Kalender.jsx
import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Impor CSS flatpickr
import axios from 'axios';
import './Kalender.css';

const Kalender = () => {
  const calendarRef = useRef(null);
  const flatpickrInstance = useRef(null);

  // Fungsi untuk memuat data berdasarkan tanggal
  const fetchData = (date) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    axios
      .get(`https://jsonplaceholder.typicode.com/posts?_limit=5&date=${formattedDate}`)
      .then((response) => {
        console.log('Data dari API:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    // Inisialisasi flatpickr
    flatpickrInstance.current = flatpickr(calendarRef.current, {
      inline: true,
      dateFormat: 'Y-m-d',
      defaultDate: new Date(),
      onChange: (selectedDates) => {
        fetchData(selectedDates[0]);
      },
    });

    // Muat data awal
    fetchData(new Date());

    // Cleanup saat komponen di-unmount
    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
  }, []);

  const goToPrevDay = () => {
    const current = flatpickrInstance.current.selectedDates[0] || new Date();
    const prevDay = new Date(current);
    prevDay.setDate(prevDay.getDate() - 1);
    flatpickrInstance.current.setDate(prevDay);
    fetchData(prevDay);
  };

  const goToNextDay = () => {
    const current = flatpickrInstance.current.selectedDates[0] || new Date();
    const nextDay = new Date(current);
    nextDay.setDate(nextDay.getDate() + 1);
    flatpickrInstance.current.setDate(nextDay);
    fetchData(nextDay);
  };

  const formatDateDisplay = () => {
    const current = flatpickrInstance.current?.selectedDates[0] || new Date();
    return current.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-btn prev" onClick={goToPrevDay}>
          ⬅️
        </button>
        <span className="current-date">{formatDateDisplay()}</span>
        <button className="nav-btn next" onClick={goToNextDay}>
          ➡️
        </button>
      </div>
      <div ref={calendarRef} className="flatpickr-calendar"></div>
    </div>
  );
};

export default Kalender;
