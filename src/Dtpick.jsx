// src/components/Dtpick.jsx
import React, { useState } from 'react';
import { getDaysInMonth } from './History';

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const hariSingkat = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function Dtpick({ value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const parse = () => {
    const parts = value.split(' ');
    return {
      day: parseInt(parts[0]),
      month: bulanList.indexOf(parts[1]),
      year: parseInt(parts[2])
    };
  };

  const { day: selectedDay, month: selectedMonth, year: selectedYear } = parse();
  const [viewMonth, setViewMonth] = useState(selectedMonth);
  const [viewYear, setViewYear] = useState(selectedYear);

  const selectDate = (day) => {
    const tglStr = `${day} ${bulanList[viewMonth]} ${viewYear}`;
    onChange(tglStr);
    setShowPicker(false);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = getDaysInMonth(viewMonth, viewYear);

  const renderDays = () => {
    const grid = [];

    // Header: hari
    hariSingkat.forEach(hari => {
      grid.push(
        <div
          key={hari}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#555',
            height: '20px',
            userSelect: 'none'
          }}
        >
          {hari}
        </div>
      );
    });

    // Kosong awal
    for (let i = 0; i < firstDay; i++) {
      grid.push(<div key={`empty-${i}`} style={{ height: '24px' }}></div>);
    }

    // Tanggal
    for (let day = 1; day <= totalDays; day++) {
      const isActive = day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;
      grid.push(
        <div
          key={day}
          onClick={() => selectDate(day)}
          style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            borderRadius: '2px',
            cursor: 'pointer',
            backgroundColor: isActive ? '#0078D7' : 'transparent',
            color: isActive ? 'white' : '#333',
            margin: '1px',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => {
            if (!isActive) e.target.style.backgroundColor = '#e6e6e6';
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.target.style.backgroundColor = 'transparent';
          }}
        >
          {day}
        </div>
      );
    }

    return grid;
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', fontFamily: 'Tahoma, Segoe UI, Arial, sans-serif' }}>
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
          padding: '6px 10px',
          width: '180px',
          fontSize: '13px',
          border: '1px solid #999',
          borderRadius: '4px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: 'white',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
        }}
      />

      {/* Popup Kalender — Mirip Excel Beneran */}
      {showPicker && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: 'white',
            border: '1px solid #999',
            borderRadius: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            zIndex: 1000,
            width: '180px',
            padding: '6px',
            fontSize: '11px',
          }}
        >
          {/* Navigasi Bulan & Tahun */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewMonth(prev => (prev === 0 ? 11 : prev - 1));
                if (viewMonth === 0) setViewYear(prev => Math.max(1, prev - 1));
              }}
              style={{
                width: '18px',
                height: '18px',
                fontSize: '12px',
                border: '1px solid #ccc',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              ‹
            </button>
            <span
              onClick={(e) => {
                e.stopPropagation();
                const y = prompt('Tahun (1-5000):', viewYear);
                const year = parseInt(y);
                if (year >= 1 && year <= 5000) setViewYear(year);
              }}
              style={{
                cursor: 'pointer',
                padding: '2px 4px',
                borderRadius: '3px'
              }}
            >
              {bulanList[viewMonth]} {viewYear}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewMonth(prev => (prev === 11 ? 0 : prev + 1));
                if (viewMonth === 11) setViewYear(prev => Math.min(5000, prev + 1));
              }}
              style={{
                width: '18px',
                height: '18px',
                fontSize: '12px',
                border: '1px solid #ccc',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              ›
            </button>
          </div>

          {/* Grid Kalender */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '1px',
              backgroundColor: '#f0f0f0',
              borderRadius: '3px',
              padding: '1px'
            }}
          >
            {renderDays()}
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
