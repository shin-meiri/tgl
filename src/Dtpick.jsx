// src/components/Dtpick.jsx
import React from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default function Dtpick({ value, onChange }) {
  return (
    <Flatpickr
      value={value}
      onChange={(selectedDates, dateStr) => {
        // Ambil string langsung — hindari Date object
        onChange(dateStr);
      }}
      options={{
        dateFormat: 'j F Y',        // Format: 16 Juli 622
        altFormat: 'j F Y',         // Tampilan di input
        allowInput: true,
        clickOpens: true,
        locale: {
          firstDayOfWeek: 1, // Senin sebagai hari pertama
        },
      }}
      style={{
        padding: '10px',
        width: '200px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        textAlign: 'center',
        fontSize: '14px',
      }}
      className="form-control"
    />
  );
        }
