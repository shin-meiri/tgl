// DatePicker.jsx
import React, { useState } from 'react';

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const hariList = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const getDaysInMonth = (bulan, tahun) => {
  if (bulan === 1) return 28; // Februari, tetap 28 untuk tahun kuno
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
  const [viewMonth, setViewMonth] = useState(selectedMonth);
  const [viewYear, setViewYear] = useState(selectedYear);

  const selectDate = (day) => {
    const tglStr = `${day} ${bulanList[viewMonth]} ${viewYear}`;
    setTanggal(tglStr);
    setShowPicker(false);
  };

  const goToPrevYear = () => {
    setViewYear(prev => (prev > 1 ? prev - 1 : 1));
  };

  const goToNextYear = () => {
    setViewYear(prev => (prev < 5000 ? prev + 1 : 5000));
  };

  const editYear = () => {
    const inputYear = prompt('Masukkan tahun (1–5000):', viewYear);
    const yearNum = parseInt(inputYear);

    if (isNaN(yearNum)) {
      alert('Harus angka!');
      return;
    }
    if (yearNum < 1) {
      alert('Tahun minimal 1.');
      return;
    }
    if (yearNum > 5000) {
      alert('Tahun maksimal 5000.');
      return;
    }

    setViewYear(yearNum);
  };

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
    <div style={{ position: 'relative', display: 'inline-block', fontFamily: 'Arial, sans-serif' }}>
      {/* Input */}
      <input
        type="text"
        value={tanggal}
        readOnly
        onClick={() => {
          setViewMonth(selectedMonth);
          setViewYear(selectedYear);
          setShowPicker(true);
        }}
        style={{
          padding: '10px 14px',
          width: '200px',
          fontSize: '14px',
          border: '1px solid #aaa',
          borderRadius: '4px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: 'white',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
        }}
      />

      {/* Popup */}
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
            width: '240px',
            padding: '12px',
          }}
        >
          {/* Navigasi Tahun & Bulan */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevYear(); }}
              style={{ fontSize: '16px', width: '24px', height: '24px' }}
            >
              ‹
            </button>

            <span
              onClick={(e) => { e.stopPropagation(); editYear(); }}
              style={{
                fontWeight: 'bold',
                color: '#0078D7',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              {bulanList[viewMonth]} {viewYear}
            </span>

            <button
              onClick={(e) => { e.stopPropagation(); goToNextYear(); }}
              style={{ fontSize: '16px', width: '24px', height: '24px' }}
            >
              ›
            </button>
          </div>

          {/* Grid Hari */}
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
        </div>
      )}

      {/* Tutup saat klik luar */}
      {showPicker && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          onClick={() => setShowPicker(false)}
        />
      )}
    </div>
  );
    }
