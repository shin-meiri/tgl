// src/components/Kalender.jsx
import React, { useState } from 'react';
import Dtpick from './Dtpick';
import Tanggal from './Tanggal';
import Weton from './Weton'; // ✅ Import
import { hitungHari } from './History';

const bulanMap = {
  'Januari': 1, 'Februari': 2, 'Maret': 3, 'April': 4, 'Mei': 5, 'Juni': 6,
  'Juli': 7, 'Agustus': 8, 'September': 9, 'Oktober': 10, 'November': 11, 'Desember': 12
};

export default function Kalender() {
  const now = new Date();
  const defaultDay = now.getDate();
  const defaultMonth = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][now.getMonth()];
  const defaultYear = now.getFullYear();

  const [tanggal, setTanggal] = useState(`${defaultDay} ${defaultMonth} ${defaultYear}`);

  const parseTgl = () => {
    const parts = tanggal.split(' ');
    return {
      day: parseInt(parts[0]),
      month: bulanMap[parts[1]],
      year: parseInt(parts[2])
    };
  };

  const { day, month, year } = parseTgl();
  const hari = hitungHari(day, month, year);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h3>Kalender Historis</h3>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        <div>
          <Dtpick value={tanggal} onChange={setTanggal} />
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
            <p><strong>Tanggal:</strong> {tanggal}</p>
            <p><strong>Hari:</strong> {hari}</p>
            <Weton tanggal={tanggal} /> {/* ✅ Weton di bawah */}
          </div>
        </div>

        <div>
          <Tanggal tanggal={tanggal} />
        </div>
      </div>
    </div>
  );
}
