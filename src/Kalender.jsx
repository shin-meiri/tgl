import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Kalender = () => {
  // Pastikan defaultDate adalah hari ini (bukan null)
  const [selectedDate, setSelectedDate] = useState(new Date());

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
      {/* === DATEPICKER (Seperti Excel) === */}
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
            defaultDate: selectedDate, // Selalu valid
            clickOpens: true,
            allowInput: false,
            onChange: (selectedDates) => {
              setSelectedDate(selectedDates[0]); // Update state
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

      {/* === KALENDER INLINE (TANPA NAVIGASI < >) === */}
      <div
        style={{
          marginTop: '10px',
          padding: '12px',
          border: '1px solid #eee',
          borderRadius: '6px',
          backgroundColor: '#f9f9f9',
          position: 'relative',
        }}
      >
        {/* Sembunyikan header flatpickr (termasuk prev/next) */}
        <style>
          {`
            .no-nav .flatpickr-month {
              display: none !important;
            }
            .no-nav .flatpickr-current-month .flatpickr-monthDropdown-months,
            .no-nav .flatpickr-current-month .flatpickr-monthDropdown-months ~ div {
              display: none !important;
            }
            .no-nav .flatpickr-current-month {
              pointer-events: none;
            }
          `}
        </style>

        <Flatpickr
          options={{
            dateFormat: 'Y-m-d',
            defaultDate: selectedDate,
            inline: true,
            // Matikan navigasi
            prevArrow: '',
            nextArrow: '',
            showMonths: 1,
            animate: false,
            // Matikan interaksi header
            onReady: (selectedDates, dateStr, instance) => {
              // Optional: tambah label bulan manual
              const container = instance.calendarContainer;
              if (!container.querySelector('.custom-month-label')) {
                const label = document.createElement('div');
                label.className = 'custom-month-label';
                label.style.cssText = `
                  text-align: center;
                  font-weight: bold;
                  margin-bottom: 8px;
                  font-size: 14px;
                  color: #333;
                `;
                const date = selectedDates[0] || new Date();
                const months = [
                  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ];
                label.textContent = `${months[date.getMonth()]} ${date.getFullYear()}`;
                container.insertBefore(label, container.firstChild);
              }
            },
            onChange: (selectedDates) => {
              setSelectedDate(selectedDates[0]);
            },
          }}
          render={({ value, ...props }, ref) => (
            <div
              ref={ref}
              {...props}
              className="no-nav" // untuk CSS custom
              style={{
                marginTop: '-10px', // offset karena label tambahan
              }}
            />
          )}
        />
      </div>

      {/* Info Tanggal Terpilih */}
      <div
        style={{
          marginTop: '12px',
          fontSize: '14px',
          color: '#555',
          textAlign: 'center',
        }}
      >
        Dipilih: <strong>{formatDate(selectedDate)}</strong>
      </div>
    </div>
  );
};

export default Kalender;
