import React, { useState } from 'react';
import Header from './Header';
import Dtpick from './Dtpick';
import Tanggal from './Tanggal';
import Desk from './Desk';

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
    setActiveTab('deskripsi'); // ✅ Pindah tab
  };

  return (
    <div >
      <Header active={activeTab} onNavigate={handleNavigate} />

      {activeTab === 'kalender' && (
        <div >
          <div >
            <Dtpick value={tanggal} onChange={setTanggal} />
          </div>
          <Tanggal tanggal={tanggal} onTanggalClick={handleTanggalClick} />
        </div>
      )}

      {activeTab === 'deskripsi' && (
        <Desk tanggal={tanggal} />
      )}
    </div>
  );
    }
