// src/components/Dtpick.jsx
import React, { useState } from 'react';
import { getDaysInMonth } from './History';

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const hariList = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function Dtpick({ value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const parse = () => {
    const parts = value.split(' ');
    const day = parseInt(parts[0]);
    const month = bulanList.indexOf(parts[1]);
    const year = parseInt(parts[2]);
    return { day, month, year };
  };

  const { day: selectedDay, month: selectedMonth, year: selectedYear } = parse();
  const [viewMonth, setViewMonth] = useState(selectedMonth);
  const [viewYear, setViewYear] = useState(selectedYear);

  const selectDate = (day) => {
    const tglStr = `${day} ${bulanList[viewMonth]} ${viewYear}`;
    onChange(tglStr);
    setShowPicker(false);
  };

  const renderDays = () => {
    // Hitung hari pertama (dengan logika Julian/Gregorian bisa ditambah nanti)
    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // Hanya untuk UI
    const totalDays = getDaysInMonth(viewMonth, viewYear);
    const grid = [];

    // Header hari
    hariList.forEach(hari => {
      grid.push(
        <span key={hari} className="flatpickr-weekday">
          {hari}
        </span>
      );
    });

    // Kosong awal
    for (let i = 0; i < firstDay; i++) {
      grid.push(<span key={`empty-${i}`} className="flatpickr-day" />);
    }

    // Tanggal
    for (let day = 1; day <= totalDays; day++) {
      const isActive = day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;
      const isToday = day === new Date().getDate() &&
                     viewMonth === new Date().getMonth() &&
                     viewYear === new Date().getFullYear();

      grid.push(
        <span
          key={day}
          className={`flatpickr-day ${isActive ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => selectDate(day)}
        >
          {day}
        </span>
      );
    }

    return grid;
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Input */}
      <input
        type="text"
        value={value}
        readOnly
        onClick={() => {
          setViewMonth(selectedMonth);
          setViewYear(selectedYear);
          setShowPicker(true);
        }}
        style={{
          padding: '10px',
          width: '200px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          textAlign: 'center',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif'
        }}
      />

      {/* Popup Kalender — Pakai CSS flatpickr */}
      {showPicker && (
        <div
          className="flatpickr-calendar animate open"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1000,
            backgroundColor: 'white',
            border: '1px solid #e6e6e6',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            width: '250px',
            padding: '10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
          }}
        >
          {/* Navigasi */}
          <div className="flatpickr-months">
            <span className="flatpickr-prev-month" onClick={() => setViewMonth(v => (v === 0 ? 11 : v - 1))}>
              ‹
            </span>
            <div className="flatpickr-current-month">
              <span>
                {bulanList[viewMonth]} {viewYear}
              </span>
            </div>
            <span className="flatpickr-next-month" onClick={() => setViewMonth(v => (v === 11 ? 0 : v + 1))}>
              ›
            </span>
          </div>

          {/* Grid Hari */}
          <div className="flatpickr-days" style={{ marginTop: '10px' }}>
            <div className="dayContainer" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {renderDays()}
            </div>
          </div>
        </div>
      )}

      {/* Close saat klik luar */}
      {showPicker && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
          }}
          onClick={() => setShowPicker(false)}
        />
      )}
    </div>
  );
      }
