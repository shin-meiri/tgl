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
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = getDaysInMonth(viewMonth, viewYear);
    const grid = [];

    // Header (mirip flatpickr)
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
      const isSelected = day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;
      const isToday = day === new Date().getDate() &&
                     viewMonth === new Date().getMonth() &&
                     viewYear === new Date().getFullYear();

      grid.push(
        <span
          key={day}
          className={`flatpickr-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => selectDate(day)}
          aria-label={day}
        >
          {day}
        </span>
      );
    }

    return grid;
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Input (mirip flatpickr) */}
      <input
        type="text"
        value={value}
        readOnly
        onClick={() => {
          setViewMonth(selectedMonth);
          setViewYear(selectedYear);
          setShowPicker(!showPicker);
        }}
        className="form-control flatpickr-input"
        style={{
          padding: '10px 12px',
          width: '200px',
          border: '1px solid #ced4da',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
          backgroundColor: 'white',
        }}
      />

      {/* Popup Kalender (pakai class flatpickr) */}
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
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            width: '240px',
            padding: '12px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
          }}
        >
          {/* Navigasi */}
          <div className="flatpickr-months">
            <span className="flatpickr-prev-month" onClick={() => setViewMonth(v => (v === 0 ? 11 : v - 1))}>
              ‹
            </span>
            <div className="flatpickr-month">
              <div className="flatpickr-current-month">
                <span className="cur-month">{bulanList[viewMonth]} {viewYear}</span>
              </div>
            </div>
            <span className="flatpickr-next-month" onClick={() => setViewMonth(v => (v === 11 ? 0 : v + 1))}>
              ›
            </span>
          </div>

          {/* Grid Hari */}
          <div className="flatpickr-innerContainer">
            <div className="flatpickr-rContainer">
              <div className="flatpickr-weekdays">
                <div className="flatpickr-weekdaycontainer">
                  {renderDays().slice(0, 7)}
                </div>
              </div>
              <div className="flatpickr-days">
                <div className="dayContainer">
                  {renderDays().slice(7)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tutup saat klik luar */}
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
