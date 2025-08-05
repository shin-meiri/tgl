// Kalender.jsx
import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Impor CSS flatpickr
import axios from 'axios';
import './Kalender.css';

const Kalender = () => {
  const calendarRef = useRef(null);
  const flatpickrInstance = useRef(null);

  // Fungsi untuk navigasi ke bulan sebelumnya
  const goToPrevMonth = () => {
    if (flatpickrInstance.current) {
      flatpickrInstance.current.changeMonth(-1);
    }
  };

  // Fungsi untuk navigasi ke bulan berikutnya
  const goToNextMonth = () => {
    if (flatpickrInstance.current) {
      flatpickrInstance.current.changeMonth(1);
    }
  };

  // Fungsi untuk mendapatkan data dari API (contoh)
  const fetchData = async (date) => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?date=${date.toISOString()}`
      );
      console.log('Data dari API:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const today = new Date();
    const fp = flatpickr(calendarRef.current, {
      inline: true,
      dateFormat: 'Y-m-d',
      defaultDate: today,
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          fetchData(selectedDates[0]);
        }
      },
      onReady: (selectedDates, dateStr, instance) => {
        // Simpan instance flatpickr agar bisa digunakan untuk navigasi
        flatpickrInstance.current = instance;
      },
    });

    // Simpan instance di useRef
    flatpickrInstance.current = fp;

    // Cleanup saat komponen di-unmount
    return () => {
      if (fp) {
        fp.destroy();
      }
    };
  }, []);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-btn prev" onClick={goToPrevMonth}>
          ⬅️
        </button>
        <span className="current-month">
          {flatpickrInstance.current
            ? flatpickrInstance.current.formatDate(
                flatpickrInstance.current.currentMonthDate,
                'F Y'
              )
            : new Date().toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric',
              })}
        </span>
        <button className="nav-btn next" onClick={goToNextMonth}>
          ➡️
        </button>
      </div>

      <div ref={calendarRef} className="flatpickr-calendar"></div>
    </div>
  );
};

export default Kalender;
