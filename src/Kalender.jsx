// Kalender.jsx
import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import axios from 'axios';
import './Kalender.css';

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState([]);

  // Nama hari dan bulan dalam bahasa Indonesia
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Format: 15 Agustus 2025
  const displayDate = `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const goToPrevMonth = () => {
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

  // Ambil data dari API saat bulan berubah
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/posts?_limit=5&month=${currentDate.getMonth() + 1}`
        );
        setData(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [currentDate]);

  // Dapatkan jumlah hari dalam bulan
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Dapatkan hari pertama bulan (0 = Minggu)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  // Array tanggal untuk grid
  const daysArray = [];
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }
  for (let date = 1; date <= daysInMonth; date++) {
    daysArray.push(date);
  }

  return (
    <div className="kalender-container">
      <h2>Kalender Bulanan</h2>

      {/* Navigasi Bulan dengan Format Nama Bulan */}
      <div className="navigation">
        <button onClick={goToPrevMonth} className="nav-btn prev">
          ⬅️
        </button>
        <span className="current-month">
          {displayDate}
        </span>
        <button onClick={goToNextMonth} className="nav-btn next">
          ➡️
        </button>
      </div>

      {/* Header Hari: Minggu - Sabtu */}
      <div className="days-header">
        {days.map((hari) => (
          <div key={hari} className="day-header">
            {hari}
          </div>
        ))}
      </div>

      {/* Grid Tanggal Kalender */}
      <div className="dates-grid">
        {daysArray.map((date, index) => (
          <div key={index} className="date-cell">
            {date}
          </div>
        ))}
      </div>

      {/* Flatpickr Inline (opsional) */}
      <div className="flatpickr-wrapper">
        <Flatpickr
          value={currentDate}
          options={{ inline: true, dateFormat: 'Y-m-d' }}
          onChange={([date]) => setCurrentDate(date)}
        />
      </div>

      {/* Data dari API */}
      <div className="api-data">
        <h3>Data dari API (Contoh)</h3>
        {data.length > 0 ? (
          <ul>
            {data.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Kalender;
