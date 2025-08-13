// ExcelDatePicker.jsx
import React, { useState } from 'react';

// Daftar bulan
const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Fungsi: dapatkan jumlah hari dalam bulan (untuk tahun biasa & kabisat)
const getDaysInMonth = (bulan, tahun) => {
  if (bulan === 1) { // Februari
    // Kabisat? (aturan Gregorian, meski tidak akurat untuk tahun sangat kuno)
    const isKabisat = (tahun % 4 === 0 && tahun % 100 !== 0) || (tahun % 400 === 0);
    return isKabisat ? 29 : 28;
  }
  const days = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[bulan];
};

export default function ExcelDatePicker() {
  const [tanggal, setTanggal] = useState('9 April 1478'); // Format: "9 April 1478"
  const [showPicker, setShowPicker] = useState(false);

  // Parse tanggal untuk popup
  const parseTgl = () => {
    const parts = tanggal.split(' ');
    const hari = parseInt(parts[0]);
    const bulan = bulanList.indexOf(parts[1]);
    const tahun = parseInt(parts[2]);
    return { hari, bulan, tahun };
  };

  const { hari: hariIni, bulan: bulanIni, tahun: tahunIni } = parseTgl();

  const [bulan, setBulan] = useState(bulanIni);
  const [tahun, setTahun] = useState(tahunIni);

  // Saat pilih tanggal di grid
  const handlePilih = (hari) => {
    const tglStr = `${hari} ${bulanList[bulan]} ${tahun}`;
    setTanggal(tglStr);
    setShowPicker(false);
  };

  // Render grid tanggal
  const renderGrid = () => {
    const hariPertama = new Date(tahun, bulan, 1).getDay(); // 0=Min, 6=Sab
    const totalHari = getDaysInMonth(bulan, tahun);
    const grid = [];
    const hariMinggu = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    // Header hari
    hariMinggu.forEach(h => {
      grid.push(
        <div key={h} className="day header">
          {h}
        </div>
      );
    });

    // Kosong di awal
    for (let i = 0; i < hariPertama; i++) {
      grid.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    // Tanggal 1 sampai akhir
    for (let hari = 1; hari <= totalHari; hari++) {
      const isActive = hari === hariIni && bulan === bulanIni && tahun === tahunIni;
      grid.push(
        <div
          key={hari}
          className={`day ${isActive ? 'active' : ''}`}
          onClick={() => handlePilih(hari)}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            padding: '6px',
            borderRadius: '4px',
            backgroundColor: isActive ? '#007bff' : 'transparent',
            color: isActive ? 'white' : 'black',
          }}
        >
          {hari}
        </div>
      );
    }

    return grid;
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', fontFamily: 'Arial, sans-serif' }}>
      {/* Input seperti Excel */}
      <input
        type="text"
        value={tanggal}
        readOnly
        onClick={() => setShowPicker(!showPicker)}
        style={{
          padding: '10px',
          fontSize: '14px',
          border: '2px solid #000',
          borderRadius: '4px',
          width: '200px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: '#fff',
        }}
      />

      {/* Popup Kalender (mirip Excel) */}
      {showPicker && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1000,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginTop: '4px',
            width: '250px',
            padding: '10px',
          }}
        >
          {/* Navigasi Bulan & Tahun */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <button
              onClick={() => setBulan(prev => (prev === 0 ? 11 : prev - 1))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
            >
              ‹
            </button>
            <div style={{ fontWeight: 'bold' }}>
              {bulanList[bulan]} {tahun}
            </div>
            <button
              onClick={() => setBulan(prev => (prev === 11 ? 0 : prev + 1))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
            >
              ›
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              fontSize: '12px',
            }}
          >
            {renderGrid()}
          </div>

          {/* Input Tahun Manual */}
          <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '12px' }}>
            <input
              type="number"
              value={tahun}
              onChange={(e) => setTahun(parseInt(e.target.value) || 1)}
              style={{ width: '70px', padding: '4px', fontSize: '12px' }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Overlay untuk close saat klik luar */}
      {showPicker && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
