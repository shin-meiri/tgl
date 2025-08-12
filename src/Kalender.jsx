import React, { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // tetap butuh dasar

const Kalender = () => {
  const inputRef = useRef(null);
  const fpInstance = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // default hari ini
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Nama hari (Minggu - Sabtu)
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Format tanggal untuk input
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Update bulan yang ditampilkan di kalender bawah
  const updateCurrentMonth = (date) => {
    const newDate = new Date(date);
    setCurrentMonth(newDate);
  };

  useEffect(() => {
    // Inisialisasi flatpickr
    fpInstance.current = flatpickr(inputRef.current, {
      dateFormat: "Y-m-d",
      defaultDate: selectedDate,
      onChange: (selectedDates) => {
        const date = selectedDates[0] || new Date();
        setSelectedDate(date);
        updateCurrentMonth(date); // Update kalender bawah
      },
    });

    return () => {
      if (fpInstance.current) {
        fpInstance.current.destroy();
      }
    };
  }, []);

  // Update flatpickr jika state berubah dari luar
  useEffect(() => {
    if (fpInstance.current) {
      fpInstance.current.setDate(selectedDate);
    }
    updateCurrentMonth(selectedDate);
  }, [selectedDate]);

  // Generate kalender manual
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Tanggal pertama dan terakhir bulan
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    const dayOffset = firstDay.getDay(); // 0 = Minggu
    startDate.setDate(firstDay.getDate() - dayOffset); // geser ke Minggu pertama

    const days = [];
    let current = new Date(startDate);

    // 6 minggu cukup untuk semua kasus
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Header bulan
    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
      <div style={calendarContainerStyle}>
        <h3 style={monthHeaderStyle}>{monthName}</h3>
        <div style={weekHeaderStyle}>
          {dayNames.map(day => (
            <div key={day} style={dayHeaderStyle}>
              {day}
            </div>
          ))}
        </div>
        <div style={daysGridStyle}>
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === month;
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                style={{
                  ...dayStyle,
                  backgroundColor: isToday ? '#e6f7ff' : 'transparent',
                  color: isCurrentMonth ? 'black' : '#ccc',
                  fontWeight: isToday ? 'bold' : 'normal',
                  border: isToday ? '1px solid #1890ff' : 'none',
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

  return (
    <div style={mainContainerStyle}>
      {/* Input dengan Flatpickr (dropdown saat klik) */}
      <div style={inputWrapperStyle}>
        🗓️
        <input
          ref={inputRef}
          type="text"
          placeholder="Pilih tanggal"
          style={inputStyle}
          readOnly
        />
      </div>

      {/* Kalender manual di bawah (selalu tampil) */}
      <div style={dividerStyle}></div>
      {renderCalendar()}
    </div>
  );
};

// ✏️ Inline Styles
const mainContainerStyle = {
  fontFamily: 'Arial, sans-serif',
  padding: '16px',
  maxWidth: '300px',
  margin: '0 auto',
};

const inputWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '12px',
};

const inputStyle = {
  padding: '8px 10px',
  fontSize: '14px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  outline: 'none',
  width: '180px',
};

const dividerStyle = {
  height: '1px',
  backgroundColor: '#ddd',
  margin: '10px 0',
};

const calendarContainerStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: '#fff',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
};

const monthHeaderStyle = {
  margin: '8px 0',
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
};

const weekHeaderStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  backgroundColor: '#f0f0f0',
  borderBottom: '1px solid #ddd',
};

const dayHeaderStyle = {
  padding: '8px',
  textAlign: 'center',
  fontSize: '12px',
  fontWeight: '600',
  color: '#555',
};

const daysGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '1px',
};

const dayStyle = {
  padding: '10px',
  textAlign: 'center',
  fontSize: '14px',
  color: '#333',
  backgroundColor: '#fafafa',
};

export default Kalender;
