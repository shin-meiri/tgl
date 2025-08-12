import React, { useState, useRef, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef(null);
  const fpInstance = useRef(null);

  // Update kalender inline saat tanggal berubah
  useEffect(() => {
    if (fpInstance.current && selectedDate) {
      fpInstance.current.setDate(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div
      style={{
        display: 'inline-block',
        fontFamily: 'Arial, sans-serif',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        width: '340px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* === DATEPICKER (Dropdown) === */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px',
          border: '1px solid #aaa',
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            padding: '8px',
            fontSize: '16px',
            backgroundColor: '#f0f0f0',
            borderRight: '1px solid #ccc',
          }}
        >
          🗓️
        </span>
        <Flatpickr
          options={{
            dateFormat: 'Y-m-d',
            defaultDate: selectedDate,
            onChange: (dates) => {
              if (dates.length > 0) {
                setSelectedDate(dates[0]);
              }
            },
            allowInput: true,
          }}
          render={({ value, ...props }, ref) => (
            <input
              ref={ref}
              value={value}
              placeholder="Pilih tanggal"
              readOnly
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                cursor: 'pointer',
              }}
              {...props}
            />
          )}
        />
      </div>

      {/* === KALENDER STATIS (Inline Flatpickr) === */}
      <div
        style={{
          marginTop: '8px',
          border: '1px solid #eee',
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        <Flatpickr
          ref={calendarRef}
          options={{
            inline: true,
            defaultDate: selectedDate,
            onChange: (dates) => {
              // Opsional: jika ingin klik di kalender juga ganti input
              if (dates.length > 0) {
                setSelectedDate(dates[0]);
              }
            },
            // Locale Indonesia (opsional)
            // locale: require('flatpickr/dist/l10n/id.js').Indonesian,
          }}
          render={({ value, ...props }, ref) => (
            <div ref={ref} {...props} />
          )}
        />
      </div>
    </div>
  );
};

export default Kalender;
