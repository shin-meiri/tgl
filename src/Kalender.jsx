import React, { useState } from 'react';
import Header from './Header';
import Dtpick from './Dtpick';
import Tanggal from './Tanggal';
import Desk from './Desk';
import url('/api/style.php');

export default function Kalender() {
  const now = new Date();
  const defaultDay = now.getDate();
  const defaultMonth = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][now.getMonth()];
  const defaultYear = now.getFullYear();

  const [tanggal, setTanggal] = useState(`${defaultDay} ${defaultMonth} ${defaultYear}`);
  const [activeTab, setActiveTab] = useState('kalender');

  return (
    <div>
      <Header active={activeTab} onNavigate={setActiveTab} />
      {activeTab === 'kalender' && (
        <>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Dtpick value={tanggal} onChange={setTanggal} />
          </div>
          <Tanggal tanggal={tanggal} onTanggalClick={setTanggal} />
        </>
      )}
      {activeTab === 'deskripsi' && <Desk tanggal={tanggal} />}
    </div>
  );
}
