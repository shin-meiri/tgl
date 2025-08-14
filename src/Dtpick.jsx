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

    // Header
    hariList.forEach(hari => {
      grid.push(
        <div key={hari} className="flatpickr-weekday">
          {hari}
        </div>
      );
    });

    // Kosong awal
    for (let i = 0; i < firstDay; i++) {
      grid.push(<div key={`empty-${i}`} className="flatpickr-day" data-disabled="true"></div>);
    }

    // Tanggal
    for (let day = 1; day <= totalDays; day++) {
      const isActive = day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;
      const isToday = day === new Date().getDate() &&
                     viewMonth === new Date().getMonth() &&
                     viewYear === new Date().getFullYear();

      grid.push(
        <div
          key={day}
          className={`flatpickr-day ${isActive ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => selectDate(day)}
        >
          {day}
        </div>
      );
    }

    return grid;
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
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

      {showPicker && (
        <div className="flatpickr-calendar animate open" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          zIndex: 1000,
          backgroundColor: 'white'
        }}>
          <div className="flatpickr-months">
            <span className="flatpickr-prev-month" onClick={() => setViewMonth(v => (v === 0 ? 11 : v - 1))}>
              ‹
            </span>
            <div className="flatpickr-current-month">
              <span>{bulanList[viewMonth]} {viewYear}</span>
            </div>
            <span className="flatpickr-next-month" onClick={() => setViewMonth(v => (v === 11 ? 0 : v + 1))}>
              ›
            </span>
          </div>

          <div className="flatpickr-days" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {renderDays()}
          </div>
        </div>
      )}

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
