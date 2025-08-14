// src/components/Dtpick.jsx
import React, { useState } from 'react';
// ❌ Hapus: import { hitungHari, getDaysInMonth } from './History';
// ✅ Ganti dengan hanya yang dipakai:
import { getDaysInMonth } from './History'; // Cuma ini yang dipakai

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
    // Kita tetap pakai new Date() hanya untuk grid UI (bukan untuk logika historis)
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = getDaysInMonth(viewMonth, viewYear); // ✅ dipakai
    const grid = [];

    // Header
    hariList.forEach(hari => {
      grid.push(
        <div key={hari} style={{
          fontSize: '11px',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '6px 0',
          color: '#555'
        }}>
          {hari}
        </div>
      );
    });

    // Kosong awal
    for (let i = 0; i < firstDay; i++) {
      grid.push(<div key={`empty-${i}`} style={{ height: '30px' }}></div>);
    }

    // Tanggal
    for (let day = 1; day <= totalDays; day++) {
      const isActive = day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;
      grid.push(
        <div
          key={day}
          onClick={() => selectDate(day)}
          style={{
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: isActive ? '#0078D7' : 'transparent',
            color: isActive ? 'white' : '#333',
            margin: '2px auto'
          }}
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
          border: '1px solid #aaa',
          borderRadius: '4px',
          textAlign: 'center',
          cursor: 'pointer'
        }}
      />

      {showPicker && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            width: '240px',
            padding: '10px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <button onClick={() => setViewMonth(v => (v === 0 ? 11 : v - 1))}>&lsaquo;</button>
            <span
              onClick={() => setViewYear(v => Math.max(1, v - 1))}
              style={{ cursor: 'pointer' }}
            >
              {bulanList[viewMonth]} {viewYear}
            </span>
            <button onClick={() => setViewMonth(v => (v === 11 ? 0 : v + 1))}>&rsaquo;</button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              backgroundColor: '#f8f8f8',
              padding: '2px',
              borderRadius: '4px'
            }}
          >
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
