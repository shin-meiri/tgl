// Kalender.jsx
import React, { useRef, useEffect, useState } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Impor CSS flatpickr
import axios from 'axios';
import './Kalender.css';

const Kalender = () => {
  const calendarRef = useRef(null);
  const flatpickrInstance = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fungsi untuk memperbarui tampilan tanggal
  const updateDisplayDate = (date) => {
    const formatted = flatpickr.formatDate(date, 'm/d/Y');
    calendarRef.current.value = formatted;
    setCurrentDate(new Date(date));
  };

  // Navigasi ke tanggal sebelumnya
  const goToPrev = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    updateDisplayDate(prevDate);
    fetchData(prevDate);
  };

  // Navigasi ke tanggal berikutnya
  const goToNext = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    updateDisplayDate(nextDate);
    fetchData(nextDate);
  };

  // Ambil data dari API berdasarkan tanggal (contoh)
  const fetchData = async (date) => {
    const formattedDate = flatpickr.formatDate(date, 'Y-m-d');
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?date=${formattedDate}`
      );
      console.log('Data dari API:', response.data);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    }
  };

  useEffect(() => {
    // Inisialisasi flatpickr
    flatpickrInstance.current = flatpickr(calendarRef.current, {
      dateFormat: 'm/d/Y',
      defaultDate: currentDate,
      onChange: (selectedDates) => {
        setCurrentDate(selectedDates[0]);
        fetchData(selectedDates[0]);
      },
      allowInput: true,
      clickOpens: false, // Kita handle klik manual jika perlu
    });

    // Cleanup saat komponen di-unmount
    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
  }, []);

  // Sinkronisasi input dengan state
  useEffect(() => {
    if (flatpickrInstance.current) {
      flatpickrInstance.current.setDate(currentDate);
    }
  }, [currentDate]);

  return (
    <div className="kalender-container">
      <h2>Kalender Interaktif</h2>
      <div className="calendar-navigation">
        <button className="nav-btn prev" onClick={goToPrev} aria-label="Previous">
          ⬅️
        </button>
        <input
          type="text"
          ref={calendarRef}
          className="flatpickr-input"
          placeholder="Pilih tanggal"
        />
        <button className="nav-btn next" onClick={goToNext} aria-label="Next">
          ➡️
        </button>
      </div>
    </div>
  );
};

export default Kalender;
