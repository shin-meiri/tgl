// ExcelDatePicker.jsx
import React, { useState, useRef, useEffect } from 'react';

const bulanList = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

const hariSingkat = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// Fungsi: jumlah hari per bulan (abaikan kabisat untuk tahun kuno jika perlu)
const getDaysInMonth = (bulan, tahun) => {
  if (bulan === 1) {
    // Opsional: nonaktifkan kabisat untuk tahun sangat kuno
    return 28;
  }
  const days = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[bulan];
};

export default function ExcelDatePicker() {
  const [tanggal, setTanggal] = useState('9 April 1478');
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  const parseTgl = () => {
    const parts = tanggal.split(' ');
    const hari = parseInt(parts[0]);
    const bulan = bulanList.indexOf(parts[1]) !== -1 ? bulanList.indexOf(parts[1]) : new Date().getMonth();
    const tahun = parseInt(parts[2]) || new Date().getFullYear();
    return { hari, bulan, tahun };
  };

  const { hari: hariIni, bulan: bulanIni, tahun: tahunIni } = parseTgl();
  const [bulan, setBulan] = useState(bulanIni);
  const [tahun, setTahun] = useState(tahunIni);

  const handlePilih = (hari) => {
    const tglStr = `${hari} ${bulanList[bulan]} ${tahun}`;
    setTanggal(tglStr);
    setShowPicker(false);
  };

  const renderGrid = () => {
    const firstDay = new Date(tahun, bulan, 1).getDay();
    const totalHari = getDaysInMonth(bulan, tahun);
    const grid = [];

    // Header hari (Singkat)
    hariSingkat.forEach(hari => {
      grid.push(
        <div key={hari} className="day header"
             style={{
               fontSize: '11px',
               fontWeight: 'bold',
               textAlign: 'center',
               padding: '4px',
               color: '#555'
             }}>
          {hari}
        </div>
      );
    });

    // Kosong di awal
    for (let i = 0; i < firstDay; i++) {
      grid.push(<div key={`empty-start-${i}`} style={{ height: '24px' }}></div>);
    }

    // Tanggal 1 - akhir
    for (let hari = 1; hari <= totalHari; hari++) {
      const isActive = hari === hariIni && bulan === bulanIni && tahun === tahunIni;
      grid.push(
        <div
          key={hari}
          onClick={() => handlePilih(hari)}
          style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            borderRadius: '2px',
            cursor: 'pointer',
            backgroundColor: isActive ? '#0078D7' : 'transparent',
            color: isActive ? 'white' : '#333',
            margin: '2px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isActive) e.target.style.backgroundColor = '#e6e6e6';
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.target.style.backgroundColor = 'transparent';
          }}
        >
          {hari}
        </div>
      );
    }

    return grid;
  };

  // Close saat klik luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Input seperti Excel */}
      <input
        type="text"
        value={tanggal}
        readOnly
        onClick={() => setShowPicker(true)}
        style={{
          padding: '8px 12px',
          fontSize: '14px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          width: '180px',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          backgroundColor: 'white',
          cursor: 'pointer',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
        }}
      />

      {/* Popup Kalender — Mirip Excel Beneran */}
      {showPicker && (
        <div
          ref={pickerRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1000,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            marginTop: '4px',
            width: '190px',
            padding: '8px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
          }}
        >
          {/* Navigasi Bulan & Tahun */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setBulan(prev => (prev === 0 ? 11 : prev - 1));
              }}
              style={{
                background: 'none',
                border: '1px solid #ccc',
                width: '20px',
                height: '20px',
                fontSize: '14px',
                cursor: 'pointer',
                color: '#555'
              }}
            >
              ‹
            </button>
            <span
              style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
              onClick={(e) => e.stopPropagation()}
              title="Klik untuk edit"
            >
              {bulanList[bulan]} {tahun}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setBulan(prev => (prev === 11 ? 0 : prev + 1));
              }}
              style={{
                background: 'none',
                border: '1px solid #ccc',
                width: '20px',
                height: '20px',
                fontSize: '14px',
                cursor: 'pointer',
                color: '#555'
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
              borderRadius: '4px',
              padding: '1px',
            }}
          >
            {renderGrid()}
          </div>

          {/* Input Tahun (opsional) */}
          <div style={{ marginTop: '8px', textAlign: 'center', fontSize: '11px', color: '#777' }}>
            <input
              type="number"
              value={tahun}
              onChange={(e) => {
                const val = e.target.value;
                if (val) setTahun(parseInt(val));
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '60px',
                padding: '4px',
                fontSize: '11px',
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: '3px'
              }}
              title="Edit tahun"
            />
          </div>
        </div>
      )}
    </div>
  );
            }
