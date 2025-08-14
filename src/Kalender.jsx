// src/components/Kalender.jsx
import React, { useState } from 'react';
import Dtpick from './Dtpick';
import { hitungHari } from './History';

const bulanMap = {
  'Januari': 1, 'Februari': 2, 'Maret': 3, 'April': 4, 'Mei': 5, 'Juni': 6,
  'Juli': 7, 'Agustus': 8, 'September': 9, 'Oktober': 10, 'November': 11, 'Desember': 12
};

export default function Kalender() {
  // Default: hari ini
  const now = new Date();
  const defaultDay = now.getDate();
  const defaultMonth = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][now.getMonth()];
  const defaultYear = now.getFullYear();

  const [tanggal, setTanggal] = useState(`${defaultDay} ${defaultMonth} ${defaultYear}`);

  // Parse string tanggal untuk hitung hari
  const parseTgl = () => {
    const parts = tanggal.split(' ');
    const day = parseInt(parts[0]);
    const month = bulanMap[parts[1]];
    const year = parseInt(parts[2]);
    return { day, month, year };
  };

  const { day, month, year } = parseTgl();
  const hari = hitungHari(day, month, year); // ✅ Akurat: 16 Juli 622 = Kamis

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h3>Kalender Historis (Tampilan Excel + Akurat)</h3>

      <div style={{ marginBottom: '20px' }}>
        <Dtpick value={tanggal} onChange={setTanggal} />
      </div>

      <div
        style={{
          padding: '15px',
          backgroundColor: '#f0f8ff',
          borderRadius: '8px',
          border: '1px solid #cce7ff',
          maxWidth: '300px',
        }}
      >
        <p><strong>Tanggal:</strong> {tanggal}</p>
        <p><strong>Hari:</strong> {hari}</p>
        <p><strong>Tahun:</strong> {isKabisat(year) ? 'Kabisat' : 'Bukan Kabisat'}</p>
      </div>
    </div>
  );
}

// Fungsi lokal (bisa dipindah ke History.jsx jika perlu)
function isKabisat(tahun) {
  if (tahun < 1582) return tahun % 4 === 0;
  return (tahun % 4 === 0) && (tahun % 100 !== 0 || tahun % 400 === 0);
      }
