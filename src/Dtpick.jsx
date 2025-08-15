// src/components/Dtpick.jsx
import React, { useState } from 'react';
import { getDaysInMonth, julianDayNumber } from '../utils/History';

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const hariList = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function getDayOfWeek(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const baseJDN = 1721424; // 1 Januari 1 M = Senin
  const selisih = jdn - baseJDN;
  const hari = (selisih % 7 + 7) % 7;
  return hari; // 0=Senin, 1=Selasa, ..., 6=Minggu
}

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

  // ✅ Sekarang benar: 1 Agustus 622 = Minggu
  const firstDay = getDayOfWeek(1, viewMonth + 1, viewYear);
  const totalDays = getDaysInMonth(viewMonth, viewYear);

  const renderDays = () => {
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
            margin: '1px auto'
          }}
        >
          {day}
        </div>
      );
    }

    return grid;
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', fontFamily: 'Tahoma, sans-serif' }}>
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
            border: '1px solid #999',
            borderRadius: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            zIndex: 1000,
            width: '180px',
            padding: '6px',
            fontSize: '11px'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
            fontWeight: 'bold'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (viewMonth === 0) {
                  setViewMonth(11);
                  setViewYear(prev => prev - 1);
                } else {
                  setViewMonth(prev => prev - 1);
                }
              }}
              style={{ width: '18px' }}
            >
              ‹
            </button>

            <span
              onClick={(e) => {
                e.stopPropagation();
                const input = prompt('Tahun (1-5000):', viewYear);
                const year = parseInt(input);
                if (year >= 1 && year <= 5000) setViewYear(year);
              }}
              style={{ cursor: 'pointer' }}
            >
              {bulanList[viewMonth]} {viewYear}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (viewMonth === 11) {
                  setViewMonth(0);
                  setViewYear(prev => prev + 1);
                } else {
                  setViewMonth(prev => prev + 1);
                }
              }}
              style={{ width: '18px' }}
            >
              ›
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            backgroundColor: '#f0f0f0',
            padding: '1px',
            borderRadius: '3px'
          }}>
            {renderDays()}
          </div>
        </div>
      )}

      {showPicker && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          onClick={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
