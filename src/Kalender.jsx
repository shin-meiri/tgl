// Kalender.jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Kalender.css'; // Untuk styling tambahan

const Kalender = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  // Daftar nama hari
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Dapatkan semua tanggal dalam bulan yang dipilih
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // Hari pertama bulan
    const totalDays = new Date(year, month + 1, 0).getDate(); // Jumlah hari

    const days = [];

    // Tambahkan blank cells untuk hari sebelum tanggal 1
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Tambahkan tanggal 1 sampai akhir bulan
    for (let date = 1; date <= totalDays; date++) {
      days.push(date);
    }

    return days;
  };

  const daysInMonth = getDaysInMonth(selectedDate);
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const currentMonthName = bulan[currentMonth];

  return (
    <div className="kalender-container">
      <h2>Kalender</h2>

      {/* Date Picker */}
      <div style={{ marginBottom: '20px' }}>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          inline // Menampilkan date picker tanpa input, langsung kalender
        />
      </div>

      {/* Hari dalam seminggu */}
      <div className="hari-header">
        {hari.map((namaHari) => (
          <div key={namaHari} className="hari-cell header">
            {namaHari}
          </div>
        ))}
      </div>

      {/* Kalender Grid */}
      <div className="kalender-grid">
        {daysInMonth.map((date, index) => {
          const isToday =
            date &&
            selectedDate.getDate() === date &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear;

          return (
            <div
              key={index}
              className={`kalender-date ${date ? '' : 'empty'} ${isToday ? 'today' : ''}`}
            >
              {date}
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        Menampilkan bulan: <strong>{currentMonthName} {currentYear}</strong>
      </p>
    </div>
  );
};

export default Kalender;
