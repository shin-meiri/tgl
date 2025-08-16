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

  const handleNavigate = (tab) => setActiveTab(tab);
  const handleTanggalClick = (tgl) => {
    setTanggal(tgl);
    setActiveTab('deskripsi');
  };

  return (
    <div className="app-container">
      <Header active={activeTab} onNavigate={handleNavigate} />
      
      {activeTab === 'kalender' && (
        <>
          <Dtpick value={tanggal} onChange={setTanggal} />
          <Tanggal tanggal={tanggal} onTanggalClick={handleTanggalClick} />
        </>
      )}

      {activeTab === 'deskripsi' && (
        <Desk tanggal={tanggal} />
      )}
    </div>
  );
      }
