// Kalender.jsx
import React, { useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import './Kalender.css';

const Kalender = () => {
  const today = new Date();
  const fpRef = useRef(null); // Untuk mengakses instance flatpickr

  const handlePrevMonth = () => {
    if (fpRef.current) {
      fpRef.current.flatpickr.changeMonth(-1);
    }
  };

  const handleNextMonth = () => {
    if (fpRef.current) {
      fpRef.current.flatpickr.changeMonth(1);
    }
  };

  const openFlatpickr = () => {
    if (fpRef.current) {
      fpRef.current.flatpickr.open();
    }
  };

  return (
    <div className="kalender-container">
      <h2>Kalender Dropdown</h2>

      {/* Tombol Navigasi dan Tanggal */}
      <div className="nav-container">
        <button onClick={handlePrevMonth} className="nav-btn">
          ⬅️
        </button>

        <div className="date-display" onClick={openFlatpickr}>
          {/* Flatpickr sebagai dropdown tersembunyi */}
          <Flatpickr
            ref={fpRef}
            options={{
              inline: false,
              altInput: true,
              altFormat: 'd/m/Y',
              dateFormat: 'Y-m-d',
              defaultDate: today,
              onChange: (selectedDates) => {
                console.log('Tanggal dipilih:', selectedDates[0]);
                // Tambahkan logika saat tanggal berubah
              },
              onOpen: () => {
                // Fokus ke bulan saat ini saat buka
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                const fp = fpRef.current.flatpickr;
                if (fp.currentYear !== currentYear || fp.currentMonth !== currentMonth) {
                  fp.jumpToDate(today);
                }
              },
            }}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <button onClick={handleNextMonth} className="nav-btn">
          ➡️
        </button>
      </div>

      {/* Info */}
      <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
        Klik tanggal di atas untuk membuka kalender.
      </p>
    </div>
  );
};

export default Kalender;
