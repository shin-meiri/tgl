// src/components/Kalender.jsx
import React, { useState } from 'react';
import Dtpick from './Dtpick';
import Tanggal from './Tanggal';

export default function Kalender() {
  // Default: hari ini
  const now = new Date();
  const defaultDay = now.getDate();
  const defaultMonth = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][now.getMonth()];
  const defaultYear = now.getFullYear();

  const [tanggal, setTanggal] = useState(`${defaultDay} ${defaultMonth} ${defaultYear}`);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '360px', margin: '0 auto' }}>
      {/* Input Pilih Tanggal */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '600' }}>
          Pilih Tanggal:
        </label>
        <Dtpick value={tanggal} onChange={setTanggal} />
      </div>

      {/* Tampilan Kalender Bulan Penuh (dengan weton di bawah tiap tanggal) */}
      <div style={{ marginTop: '10px' }}>
        <Tanggal tanggal={tanggal} />
      </div>
    </div>
  );
      }
