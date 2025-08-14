// DatePicker.jsx
import React, { useState } from 'react';

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const hariList = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// Fungsi: jumlah hari per bulan (tanpa kabisat untuk tahun kuno)
const getDaysInMonth = (bulan, tahun) => {
  if (bulan === 1) return 28; // Februari selalu 28
  const days = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[bulan];
};

export default function DatePicker() {
  const now = new Date();
  const defaultDay = now.getDate();
  const defaultMonth = now.getMonth();
  const defaultYear = now.getFullYear();

  const [tanggal, setTanggal] = useState(`${defaultDay} ${bulanList[defaultMonth]} ${defaultYear}`);
  const [showPicker, setShowPicker] = useState(false);

  const parse = () => {
    const [day, monthName, year] = tanggal.split(' ');
    return {
      day: parseInt(day),
      month: bulanList.indexOf(monthName),
      year: parseInt(year)
    };
  };

  const { day: selectedDay, month: selectedMonth, year: selectedYear } = parse();
  const [view, setView] = useState('day'); // 'day', 'month', 'year'
  const [viewMonth, setViewMonth] = useState(selectedMonth);
  const [viewYear, setViewYear] = useState(selectedYear);

  // Saat pilih tanggal
  const selectDay = (day) => {
    const tglStr = `${day} ${bulanList[viewMonth]} ${viewYear}`;
    setTanggal(tglStr);
    setShowPicker(false);
  };

  // Saat pilih bulan
  const selectMonth = (monthIndex) => {
    setViewMonth(monthIndex);
    setView('day');
  };

  // Saat pilih tahun
  const selectYear = (year) => {
    setViewYear(year);
    setView('month');
  };

  // Render grid tanggal
  const renderDays = () => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = getDaysInMonth(viewMonth, viewYear);
    const grid = [];

    // Header hari
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
      grid.push(<div key={`empty-start-${i}`} style={{ height: '30px' }}></div>);
    }

    // Tanggal 1 - akhir
    for (let day = 1; day <= totalDays; day++) {
      const isActive = day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;
      grid.push(
        <div
          key={day}
          onClick={() => selectDay(day)}
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

  // Render grid bulan
  const renderMonths = () => {
    return bulanList.map((bulan, i) => {
      const isActive = i === selectedMonth && viewYear === selectedYear;
      return (
        <div
          key={bulan}
          onClick={() => selectMonth(i)}
          style={{
            width: '50px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: isActive ? '#0078D7' : 'transparent',
            color: isActive ? 'white' : '#333',
            margin: '4px'
          }}
          onMouseEnter={(e) => {
            if (!isActive) e.target.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.target.style.backgroundColor = 'transparent';
          }}
        >
          {bulan.slice(0, 3)}
        </div>
      );
    });
  };

  // Render grid tahun (1 s.d. 5000)
  const renderYears = () => {
    const start = Math.floor((viewYear - 1) / 12) * 12 + 1;
    const years = Array.from({ length: 12 }, (_, i) => start + i);

    return years.map(year => {
      const isActive = year === selectedYear;
      return (
        <div
          key={year}
          onClick={() => selectYear(year)}
          style={{
            width: '50px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: isActive ? '#0078D7' : 'transparent',
            color: isActive ? 'white' : '#333',
            margin: '4px'
          }}
          onMouseEnter={(e) => {
            if (!isActive) e.target.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.target.style.backgroundColor = 'transparent';
          }}
        >
          {year}
        </div>
      );
    });
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', fontFamily: 'Arial, sans-serif' }}>
      {/* Input */}
      <input
        type="text"
        value={tanggal}
        readOnly
        onClick={() => {
          setViewMonth(selectedMonth);
          setViewYear(selectedYear);
          setView('day');
          setShowPicker(true);
        }}
        style={{
          padding: '10px 14px',
          width: '220px',
          fontSize: '14px',
          border: '1px solid #aaa',
          borderRadius: '4px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: 'white',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
        }}
      />

      {/* Popup Kalender */}
      {showPicker && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
            zIndex: 1000,
            width: '260px',
            padding: '12px',
          }}
        >
          {/* Navigasi dan Judul */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (view === 'year') {
                  setViewYear(prev => Math.max(1, prev - 12));
                } else if (view === 'month') {
                  setViewYear(prev => Math.max(1, prev - 1));
                } else {
                  setViewMonth(prev => (prev === 0 ? 11 : prev - 1));
                  if (viewMonth === 0) setViewYear(prev => Math.max(1, prev - 1));
                }
              }}
              style={{ fontSize: '16px', width: '24px', height: '24px' }}
            >
              ‹
            </button>

            <span
              onClick={(e) => {
                e.stopPropagation();
                if (view === 'day') setView('month');
                else if (view === 'month') setView('year');
              }}
              style={{
                fontWeight: 'bold',
                color: '#0078D7',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              {view === 'day' && `${bulanList[viewMonth]} ${viewYear}`}
              {view === 'month' && `${viewYear}`}
              {view === 'year' && `${Math.floor((viewYear - 1) / 12) * 12 + 1} - ${Math.floor((viewYear - 1) / 12) * 12 + 12}`}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (view === 'year') {
                  setViewYear(prev => Math.min(4989, prev + 12));
                } else if (view === 'month') {
                  setViewYear(prev => Math.min(5000, prev + 1));
                } else {
                  setViewMonth(prev => (prev === 11 ? 0 : prev + 1));
                  if (viewMonth === 11) setViewYear(prev => Math.min(5000, prev + 1));
                }
              }}
              style={{ fontSize: '16px', width: '24px', height: '24px' }}
            >
              ›
            </button>
          </div>

          {/* Grid Berdasarkan View */}
          {view === 'day' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              backgroundColor: '#f8f8f8',
              padding: '2px',
              borderRadius: '4px'
            }}>
              {renderDays()}
            </div>
          )}

          {view === 'month' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              padding: '4px'
            }}>
              {renderMonths()}
            </div>
          )}

          {view === 'year' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              padding: '4px'
            }}>
              {renderYears()}
            </div>
          )}
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
