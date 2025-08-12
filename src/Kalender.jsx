import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // tetap butuh CSS dasar Flatpickr

const ExcelDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Helper: Dapatkan array tanggal untuk grid kalender (6 baris x 7 kolom)
  const getCalendarDays = (date) => {
    const today = new Date(date);
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Hitung hari pertama Minggu sebelum tanggal 1
    startDate.setDate(firstDay.getDate() - firstDay.getDay()); // Minggu pertama

    const days = [];
    let current = new Date(startDate);

    // 6 baris (42 hari) cukup untuk semua bulan
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const days = getCalendarDays(selectedDate);

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '16px' }}>
      {/* Dropdown Flatpickr */}
      <div style={{ marginBottom: '12px' }}>
        <Flatpickr
          value={selectedDate}
          onChange={(dateArr) => setSelectedDate(dateArr[0])}
          options={{
            dateFormat: 'Y-m-d',
            defaultDate: 'today',
          }}
          style={{
            padding: '8px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Nama Hari */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          fontWeight: 'bold',
          backgroundColor: '#f0f0f0',
          padding: '8px 0',
          marginBottom: '4px',
        }}
      >
        {dayNames.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Kalender Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          gap: '2px',
        }}
      >
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
          const isToday =
            day.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              style={{
                padding: '8px 0',
                backgroundColor: isToday
                  ? '#ffe0b2'
                  : isCurrentMonth
                  ? '#fff'
                  : '#f5f5f5',
                color: isCurrentMonth ? '#000' : '#aaa',
                border: isToday ? '1px solid #ff8a65' : 'none',
                borderRadius: isToday ? '4px' : '0',
              }}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExcelDatePicker;
