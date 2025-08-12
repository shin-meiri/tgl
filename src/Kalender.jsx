import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Tetap butuh dasar

const Kalender = () => {
  // State: tanggal yang dipilih
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format tanggal untuk tampilan
  const formatDate = (date) => {
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
      {/* === DATEPICKER (Dropdown seperti Excel) === */}
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
            allowInput: false,
            onChange: (selectedDates) => {
              setSelectedDate(selectedDates[0]);
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

      {/* === KALENDER INLINE (Menampilkan 1 bulan sesuai pilihan) === */}
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
            defaultDate: selectedDate,
            inline: true, // Kalender tampil permanen
            onChange: (selectedDates) => {
              setSelectedDate(selectedDates[0]);
            },
          }}
          render={({ value, ...props }, ref) => (
            <div ref={ref} {...props} />
          )}
        />
      </div>

      {/* Tampilkan tanggal terpilih (opsional) */}
      <div
        style={{
          marginTop: '12px',
          fontSize: '14px',
          color: '#555',
          textAlign: 'center',
        }}
      >
        Tanggal dipilih: <strong>{formatDate(selectedDate)}</strong>
      </div>
    </div>
  );
};

export default Kalender;
