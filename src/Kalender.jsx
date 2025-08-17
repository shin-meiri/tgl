// src/components/Kalender.jsx
import React, { useState } from 'react';
import Header from './Header';
import Dtpick from './Dtpick';
import Tanggal from './Tanggal';
import Desk from './Desk';
import Arab from './Arab'; // ✅ Import Arab.jsx

export default function Kalender() {
  const now = new Date();
  const defaultDay = now.getDate();
  const defaultMonth = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][now.getMonth()];
  const defaultYear = now.getFullYear();

  const [tanggal, setTanggal] = useState(`${defaultDay} ${defaultMonth} ${defaultYear}`);
  const [activeTab, setActiveTab] = useState('kalender');

  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  const handleTanggalClick = (tgl) => {
    setTanggal(tgl);
    setActiveTab('deskripsi');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      {/* Header Navigasi */}
      <Header active={activeTab} onNavigate={handleNavigate} />

      {/* Konten Berdasarkan Tab */}
      {activeTab === 'kalender' && (
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <Dtpick value={tanggal} onChange={setTanggal} />
          </div>
          <Tanggal tanggal={tanggal} onTanggalClick={handleTanggalClick} />
        </div>
      )}

      {activeTab === 'hijriah' && (
        <div style={{ padding: '20px' }}>
          {/* Arab.jsx akan handle Dtpick dan tampilan kalender Hijriyah */}
          <Arab />
        </div>
      )}

      {activeTab === 'deskripsi' && (
        <Desk tanggal={tanggal} />
      )}
    </div>
  );
          }
