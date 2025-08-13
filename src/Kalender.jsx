// ExcelDatePicker.jsx
import React, { useState, useEffect } from 'react';

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const hariSingkat = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function ExcelDatePicker() {
  const [tanggal, setTanggal] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState('date'); // 'date', 'month', 'year'
  const [bulan, setBulan] = useState(0);
  const [tahun, setTahun] = useState(2025);

  // Default: hari ini (tapi aman untuk tahun < 1000)
  useEffect(() => {
    const now = new Date();
    const hariIni = now.getDate();
    const bulanIni = now.getMonth();
    const tahunIni = now.getFullYear();

    setBulan(bulanIni);
    setTahun(tahunIni);
    setTanggal(`${hariIni} ${bulanList[bulanIni]} ${tahunIni}`);
  }, []);

  // Grid: Tanggal 1–31
  const renderDateGrid = () => {
    return Array.from({ length: 31 }, (_, i) => i + 1).map(hari => (
      <div
        key={hari}
        onClick={() => {
          setTanggal(`${hari} ${bulanList[bulan]} ${tahun}`);
          setShowPicker(false);
        }}
        style={style.cell}
      >
        {hari}
      </div>
    ));
  };

  // Grid: Bulan
  const renderMonthGrid = () => {
    return bulanList.map((nama, idx) => (
      <div
        key={nama}
        onClick={() => {
          setBulan(idx);
          setMode('date');
        }}
        style={{
          ...style.cell,
          backgroundColor: idx === bulan ? '#0078D7' : 'transparent',
          color: idx === bulan ? 'white' : '#333',
        }}
      >
        {nama.slice(0, 3)}
      </div>
    ));
  };

  // Grid: Tahun (1–5000)
  const renderYearGrid = () => {
    const start = Math.floor((tahun - 1) / 12) * 12 + 1;
    const years = Array.from({ length: 12 }, (_, i) => start + i);
    return years.map(y => (
      <div
        key={y}
        onClick={() => {
          if (y >= 1 && y <= 5000) {
            setTahun(y);
            setMode('month');
          }
        }}
        style={{
          ...style.cell,
          backgroundColor: y === tahun ? '#0078D7' : 'transparent',
          color: y === tahun ? 'white' : (y < 1 || y > 5000 ? '#ccc' : '#333'),
          cursor: y < 1 || y > 5000 ? 'not-allowed' : 'pointer',
        }}
      >
        {y}
      </div>
    ));
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', fontFamily: 'Arial, sans-serif' }}>
      {/* Input */}
      <input
        type="text"
        value={tanggal}
        readOnly
        onClick={() => {
          setShowPicker(true);
          setMode('date');
        }}
        style={{
          padding: '10px 12px',
          width: '200px',
          fontSize: '14px',
          border: '1px solid #aaa',
          borderRadius: '4px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: 'white',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
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
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            zIndex: 1000,
            width: '240px',
            padding: '12px',
          }}
        >
          {/* Header: Navigasi */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
            <span
              onClick={() => setMode('month')}
              style={{ fontWeight: 'bold', cursor: 'pointer', color: '#0078D7' }}
            >
              {bulanList[bulan]}
            </span>
            <span
              onClick={() => setMode('year')}
              style={{ fontWeight: 'bold', cursor: 'pointer', color: '#0078D7' }}
            >
              {tahun}
            </span>
          </div>

          {/* Grid Isi */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px',
            }}
          >
            {mode === 'date' && renderDateGrid()}
            {mode === 'month' && renderMonthGrid()}
            {mode === 'year' && renderYearGrid()}
          </div>

          {/* Footer: Info Mode */}
          <div style={{ marginTop: '10px', fontSize: '11px', color: '#777', textAlign: 'center' }}>
            {mode === 'date' && 'Pilih hari'}
            {mode === 'month' && 'Pilih bulan'}
            {mode === 'year' && 'Pilih tahun (1–5000)'}
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

// Gaya seperti Excel
const style = {
  cell: {
    width: '40px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '2px auto',
    transition: 'all 0.2s',
  },
};
