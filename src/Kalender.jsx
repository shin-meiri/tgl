// Kalender.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Impor tema flatpickr
import './Kalender.css';

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [loading, setLoading] = useState(false);

  const hariNama = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulanNama = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Fungsi untuk membuat array hari dalam bulan
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
    const daysCount = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tambahkan hari kosong di awal (sebelum tanggal 1)
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Tambahkan tanggal 1 sampai akhir bulan
    for (let day = 1; day <= daysCount; day++) {
      days.push(day);
    }

    setDaysInMonth(days);
  };

  // Handle navigasi bulan
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

  // Simulasi fetch data dari API (misalnya acara)
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://jsonplaceholder.typicode.com/posts?_limit=5`)
      .then(res => {
        console.log('Data dari API:', res.data);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentDate]);

  // Generate kalender saat tanggal berubah
  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="kalender-container">
      <div className="kalender-header">
        <button className="nav-btn prev" onClick={goToPreviousMonth} aria-label="Bulan Sebelumnya">
          ⬅️
        </button>
        <h2 className="month-year">
          {bulanNama[currentMonth]} {currentYear}
        </h2>
        <button className="nav-btn next" onClick={goToNextMonth} aria-label="Bulan Berikutnya">
          ➡️
        </button>
      </div>

      <div className="hari-header">
        {hariNama.map(hari => (
          <div key={hari} className="hari-label">
            {hari}
          </div>
        ))}
      </div>

      <div className="dates-grid">
        {daysInMonth.map((day, index) => (
          <div key={index} className={`date-box ${day ? '' : 'empty'}`}>
            {day}
          </div>
        ))}
      </div>

      {loading && <div className="loading">Memuat data...</div>}
    </div>
  );
};

export default Kalender;
