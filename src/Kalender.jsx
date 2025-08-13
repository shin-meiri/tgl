// SimpleDatePicker.jsx
import React, { useState, useEffect } from 'react';

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April',
  'Mei', 'Juni', 'Juli', 'Agustus',
  'September', 'Oktober', 'November', 'Desember'
];

export default function SimpleDatePicker() {
  const [tanggal, setTanggal] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState('date'); // 'date', 'month', 'year'
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  // Default: hari ini
  useEffect(() => {
    const today = new Date();
    const tglStr = `${today.getDate()} ${bulanList[today.getMonth()]} ${today.getFullYear()}`;
    setTanggal(tglStr);
    setViewYear(today.getFullYear());
  }, []);

  // Parse tanggal saat ini
  const parse = () => {
    const [hari, bulan, tahun] = tanggal.split(' ');
    return {
      hari: parseInt(hari),
      bulan: bulanList.indexOf(bulan),
      tahun: parseInt(tahun)
    };
  };

  const { hari: hariIni, bulan: bulanIni, tahun: tahunIni } = parse();

  // --- Render Grid Hari (1-31) ---
  const renderDateGrid = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
        marginBottom: '12px',
      }}
    >
      {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(hari => (
        <div
          key={hari}
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#555',
            padding: '4px 0',
          }}
        >
          {hari}
        </div>
      ))}

      {Array.from({ length: 31 }, (_, i) => i + 1).map(hari => {
        const isActive = hari === hariIni && viewYear === tahunIni && bulanIni === parse().bulan;
        return (
          <div
            key={hari}
            onClick={() => {
              setTanggal(`${hari} ${bulanList[bulanIni]} ${viewYear}`);
              setShowPicker(false);
            }}
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '0 auto',
              backgroundColor: isActive ? '#0078D7' : 'transparent',
              color: isActive ? 'white' : '#333',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.target.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.target.style.backgroundColor = 'transparent';
            }}
          >
            {hari}
          </div>
        );
      })}
    </div>
  );

  // --- Render Grid Bulan ---
  const renderMonthGrid = () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        marginBottom: '12px',
      }}
    >
      {bulanList.map((bulan, idx) => {
        const isActive = idx === bulanIni && viewYear === tahunIni;
        return (
          <div
            key={bulan}
            onClick={() => {
              setTanggal(`${hariIni} ${bulan} ${viewYear}`);
              setMode('date');
            }}
            style={{
              padding: '8px 4px',
              fontSize: '12px',
              textAlign: 'center',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: isActive ? '#0078D7' : 'transparent',
              color: isActive ? 'white' : '#333',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.target.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.target.style.backgroundColor = 'transparent';
            }}
          >
            {bulan.substring(0, 3)}
          </div>
        );
      })}
    </div>
  );

  // --- Render Grid Tahun (1-5000) ---
  const renderYearGrid = () => {
    const start = Math.floor((viewYear - 1) / 12) * 12 + 1;
    const years = Array.from({ length: 12 }, (_, i) => start + i);

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '6px',
          marginBottom: '12px',
        }}
      >
        {years.map(yr => {
          const isActive = yr === tahunIni;
          return (
            <div
              key={yr}
              onClick={() => {
                setViewYear(yr);
                setTanggal(`${hariIni} ${bulanList[bulanIni]} ${yr}`);
                setMode('month');
              }}
              style={{
                padding: '6px 0',
                fontSize: '12px',
                textAlign: 'center',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: isActive ? '#0078D7' : 'transparent',
                color: isActive ? 'white' : yr < 1 || yr > 5000 ? '#ccc' : '#333',
              }}
              onMouseEnter={(e) => {
                if (!isActive && yr >= 1 && yr <= 5000) e.target.style.backgroundColor = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.target.style.backgroundColor = 'transparent';
              }}
            >
              {yr}
            </div>
          );
        })}
      </div>
    );
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
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            zIndex: 1000,
            width: '240px',
            padding: '12px',
          }}
        >
          {/* Header Navigasi */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMode(mode === 'date' ? 'year' : mode === 'month' ? 'date' : 'year');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#0078D7',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              {mode === 'date' ? `${bulanList[bulanIni]} ${viewYear}` : mode === 'month' ? viewYear : ''}
            </button>

            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewYear(prev => Math.max(1, prev - 1));
                }}
                style={{ fontSize: '14px', width: '24px' }}
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewYear(prev => Math.min(5000, prev + 1));
                }}
                style={{ fontSize: '14px', width: '24px' }}
              >
                ›
              </button>
            </div>
          </div>

          {/* Tampilkan Grid Sesuai Mode */}
          {mode === 'date' && (
            <>
              {renderDateGrid()}
              <button
                onClick={() => setMode('month')}
                style={{
                  fontSize: '12px',
                  padding: '4px 8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '100%',
                  backgroundColor: '#f9f9f9',
                }}
              >
                {bulanList[bulanIni]}, {viewYear}
              </button>
            </>
          )}

          {mode === 'month' && (
            <>
              {renderMonthGrid()}
              <button
                onClick={() => setMode('year')}
                style={{
                  fontSize: '12px',
                  padding: '4px 8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '100%',
                  backgroundColor: '#f9f9f9',
                }}
              >
                {viewYear}
              </button>
            </>
          )}

          {mode === 'year' && renderYearGrid()}
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
