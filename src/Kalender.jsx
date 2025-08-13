// SimpleDatePicker.jsx
import React, { useState } from 'react';

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function SimpleDatePicker() {
  const [tanggal, setTanggal] = useState('9 April 1478');
  const [show, setShow] = useState(false);

  // Daftar tahun (bisa disesuaikan)
  const tahunList = Array.from({ length: 3000 }, (_, i) => 1 + i); // 1470–1489

  return (
    <div style={{ position: 'relative', display: 'inline-block', fontFamily: 'Arial, sans-serif' }}>
      {/* Input */}
      <input
        type="text"
        value={tanggal}
        readOnly
        onClick={() => setShow(!show)}
        style={{
          padding: '10px',
          width: '180px',
          fontSize: '14px',
          border: '1px solid #aaa',
          borderRadius: '4px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: 'white',
        }}
      />

      {/* Popup */}
      {show && (
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
            width: '220px',
            padding: '12px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>
            Pilih Tanggal
          </h4>

          {/* Grid Tanggal */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '10px',
            }}
          >
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(hari => (
              <div
                key={hari}
                style={{
                  fontSize: '11px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#555',
                }}
              >
                {hari}
              </div>
            ))}

            {/* Tanggal 1–31 (dummy, bisa diganti logika sesungguhnya) */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map(hari => (
              <div
                key={hari}
                onClick={() => {
                  setTanggal(`${hari} April 1478`);
                  setShow(false);
                }}
                style={{
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  margin: '0 auto',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {hari}
              </div>
            ))}
          </div>

          {/* Dropdown Bulan & Tahun */}
          <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
            <select
              defaultValue="April"
              onChange={(e) => {
                const bulan = e.target.value;
                setTanggal(`${tanggal.split(' ')[0]} ${bulan} ${tanggal.split(' ')[2]}`);
              }}
              style={{ padding: '4px', fontSize: '12px' }}
            >
              {bulanList.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select
              defaultValue="1478"
              onChange={(e) => {
                const tahun = e.target.value;
                setTanggal(`${tanggal.split(' ')[0]} ${tanggal.split(' ')[1]} ${tahun}`);
              }}
              style={{ padding: '4px', fontSize: '12px' }}
            >
              {tahunList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Tutup saat klik luar */}
      {show && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
          }}
          onClick={() => setShow(false)}
        />
      )}
    </div>
  );
                                                       }
