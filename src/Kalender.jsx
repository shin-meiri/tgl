// Kalender.jsx
import React, { useEffect, useRef, useState } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Import default style flatpickr
import axios from 'axios';
import './Kalender.css';

const Kalender = () => {
  const inputRef = useRef(null);
  const flatpickrInstance = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format tanggal: 5/8/2025
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Update tampilan tanggal
  const updateDateDisplay = (date) => {
    setCurrentDate(new Date(date));
    // Contoh: kirim request ke API saat tanggal berubah
    axios.get(`/api/data?date=${date.toISOString().split('T')[0]}`)
      .then(response => console.log('Data:', response.data))
      .catch(err => console.error('Error fetching data:', err));
  };

  // Inisialisasi flatpickr
  useEffect(() => {
    flatpickrInstance.current = flatpickr(inputRef.current, {
      dateFormat: 'd/m/Y',
      defaultDate: currentDate,
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          updateDateDisplay(selectedDates[0]);
        }
      },
      allowInput: true,
    });

    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
  }, []);

  // Navigasi ke hari sebelumnya
  const goToPrevDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    flatpickrInstance.current.setDate(prevDay);
    updateDateDisplay(prevDay);
  };

  // Navigasi ke hari berikutnya
  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    flatpickrInstance.current.setDate(nextDay);
    updateDateDisplay(nextDay);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={goToPrevDay} className="nav-btn prev-btn">
          ⬅️
        </button>
        <input
          type="text"
          ref={inputRef}
          className="date-input"
          placeholder="Pilih tanggal"
        />
        <button onClick={goToNextDay} className="nav-btn next-btn">
          ➡️
        </button>
      </div>
      <div className="current-date-display">
        Tanggal Dipilih: <strong>{formatDate(currentDate)}</strong>
      </div>
    </div>
  );
};

export default Kalender;
