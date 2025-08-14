// src/components/Kalender.jsx
import React, { useState } from 'react';
import Dtpick from './Dtpick';
import { hitungHari } from './History';

export default function Kalender() {
  // Default: hari ini
  const now = new Date();
  const defaultDay = now.getDate();
  const defaultMonth = now.getMonth();
  const defaultYear = now.getFullYear();

  const [tanggal, setTanggal] = useState(`${defaultDay} ${['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][defaultMonth]} ${defaultYear}`);

  // Ekstrak untuk hitung hari
  const parseTgl = () => {
    const parts = tanggal.split(' ');
    return {
      day: parseInt(parts[0]),
      month: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].indexOf(parts[1]),
      year: parseInt(parts[2])
    };
  };

  const { day, month, year } = parseTgl();
  const hari = hitungHari(day, month + 1, year); // month+1 karena index 0

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h3>Kalender Historis (Akurat Secara Kalender)</h3>

      <div style={{ marginBottom: '20px' }}>
        <Dtpick value={tanggal} onChange={setTanggal} />
      </div>

      <div style={{ padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '6px' }}>
        <p><strong>Tanggal:</strong> {tanggal}</p>
        <p><strong>Hari:</strong> {hari}</p>
        <p><strong>Status:</strong> {isKabisat(year) ? 'Tahun Kabisat' : 'Bukan Kabisat'}</p>
      </div>
    </div>
  );
}

// Import lokal karena hanya dipakai di sini
function isKabisat(tahun) {
  if (tahun < 1582) return tahun % 4 === 0;
  return (tahun % 4 === 0) && (tahun % 100 !== 0 || tahun % 400 === 0);
    }
