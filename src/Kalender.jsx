// src/components/Kalender.jsx
import React, { useState } from 'react';
import Header from './Header';
import Dtpick from './Dtpick';
import Tanggal from './Tanggal';

export default function Kalender() {
  const now = new Date();
  const defaultDay = now.getDate();
  const defaultMonth = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][now.getMonth()];
  const defaultYear = now.getFullYear();

  const [tanggal, setTanggal] = useState(`${defaultDay} ${defaultMonth} ${defaultYear}`);
  const [activeTab, setActiveTab] = useState('kalender');

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    // Di sini nanti bisa tambah logika: ganti konten
  };

  // Hanya tampilkan halaman kalender untuk sekarang
  // Bisa dikembangkan: jika activeTab === 'deskripsi' → tampilkan deskripsi
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      {/* Header Navigasi */}
      <Header active={activeTab} onNavigate={handleNavigate} />

      {/* Konten */}
      {activeTab === 'kalender' && (
        <div style={{ padding: '20px' }}>
          {/* Datepicker tanpa label */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <Dtpick value={tanggal} onChange={setTanggal} />
          </div>

          {/* Kalender Bulan + Weton + Libur */}
          <Tanggal tanggal={tanggal} />
        </div>
      )}

      {activeTab === 'deskripsi' && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#555' }}>
          <h4>Deskripsi Fitur Kalender</h4>
          <p>Kalender ini mendukung:</p>
          <ul style={{ textAlign: 'left', fontSize: '14px' }}>
            <li>Tanggal historis (1 M - 5000 M)</li>
            <li>Weton Jawa (Legi, Pahing, Pon, Wage, Kliwon)</li>
            <li>Hari libur dari database</li>
            <li>Akurasi kalender Julian & Gregorian</li>
          </ul>
        </div>
      )}
    </div>
  );
          }
