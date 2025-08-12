import React, { useState, useEffect, useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Bisa di-set ke 622
  const inlineCalendarRef = useRef(null);
  const fpInstance = useRef(null);

  // Update inline calendar saat tanggal berubah
  useEffect(() => {
    if (inlineCalendarRef.current && !fpInstance.current) {
      fpInstance.current = flatpickr(inlineCalendarRef.current, {
        inline: true,
        defaultDate: selectedDate,
        onChange: (dates) => {
          setSelectedDate(dates[0]);
        },
        // Locale Indonesia (opsional)
        // locale: require("flatpickr/dist/l10n/id.js").Indonesian,
      });
    } else if (fpInstance.current) {
      fpInstance.current.setDate(selectedDate);
    }

    return () => {
      if (fpInstance.current) {
        fpInstance.current.destroy();
        fpInstance.current = null;
      }
    };
  }, [selectedDate]);

  const handleDateChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  return (
    <div
      style={{
        display: 'inline-block',
        fontFamily: 'Arial, sans-serif',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        maxWidth: '320px',
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
            onChange: handleDateChange,
          }}
          render={({ value, ...props }, ref) => (
            <input
              ref={ref}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                cursor: 'pointer',
              }}
              value={value}
              placeholder="Pilih tanggal"
              readOnly
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
        <div ref={inlineCalendarRef} />
      </div>
    </div>
  );
};

export default Kalender;
