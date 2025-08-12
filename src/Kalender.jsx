import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Kalender = () => {
  // Pastikan initial date adalah Date valid
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    if (!date) return 'Pilih tanggal';
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '16px',
        maxWidth: '320px',
        margin: '0 auto',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      {/* === DATEPICKER === */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #aaa',
          borderRadius: '4px',
          padding: '8px 10px',
          fontSize: '14px',
          cursor: 'pointer',
          backgroundColor: '#fff',
          marginBottom: '16px',
        }}
      >
        <span style={{ marginRight: '8px', fontSize: '16px' }}>🗓️</span>
        <Flatpickr
          options={{
            dateFormat: 'Y-m-d',
            defaultDate: selectedDate,
            clickOpens: true,
            onChange: (selectedDates) => {
              // 🔴 Pastikan yang diset adalah Date object, bukan string
              const validDate = selectedDates[0] ? new Date(selectedDates[0]) : new Date();
              setSelectedDate(validDate);
            },
          }}
          render={({ value, ...props }, ref) => (
            <input
              ref={ref}
              type="text"
              readOnly
              placeholder="Pilih tanggal"
              value={value || formatDate(selectedDate)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                flexGrow: 1,
                cursor: 'pointer',
              }}
              {...props}
            />
          )}
        />
      </div>

      {/* === KALENDER INLINE === */}
      <div
        style={{
          marginTop: '10px',
          padding: '12px',
          border: '1px solid #eee',
          borderRadius: '6px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Flatpickr
          options={{
            dateFormat: 'Y-m-d',
            // 🔴 Pastikan defaultDate adalah Date object
            defaultDate: selectedDate,
            inline: true,
            onChange: (selectedDates) => {
              const validDate = selectedDates[0] ? new Date(selectedDates[0]) : new Date();
              setSelectedDate(validDate);
            },
          }}
          render={({ value, ...props }, ref) => (
            <div ref={ref} {...props} />
          )}
        />
      </div>

      {/* Debug: Cek tahun yang sebenarnya */}
      <div
        style={{
          marginTop: '12px',
          fontSize: '12px',
          color: selectedDate.getFullYear() < 1000 ? 'red' : '#555',
          textAlign: 'center',
        }}
      >
        {selectedDate && !isNaN(selectedDate.getTime()) ? (
          <>Tahun: <strong>{selectedDate.getFullYear()}</strong> (valid)</>
        ) : (
          <><strong style={{ color: 'red' }}>Error: Tanggal tidak valid!</strong></>
        )}
      </div>
    </div>
  );
};

export default Kalender;
