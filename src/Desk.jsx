// src/components/Desk.jsx
import React, { useState } from 'react';
import Dtpick from './Dtpick';
import { hitungHari as hitungHariUtil } from '../utils/History';
import { masehiToWeton, neptuHari, neptuPasaran } from '../utils/WetonUtils';

// Nama bulan
const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function Desk({ tanggal }) {
  // Tanggal kamu (dari props)
  const [pasangan, setPasangan] = useState('1 Januari 2000'); // default

  // Hitung weton kamu
  const wetonKamu = tanggal ? masehiToWeton(tanggal) : null;
  const wetonPasangan = masehiToWeton(pasangan);

  // Hitung neptu
  const neptuKamu = wetonKamu ? neptuHari[wetonKamu.hari] + neptuPasaran[wetonKamu.pasaran] : 0;
  const neptuPas = wetonPasangan ? neptuHari[wetonPasangan.hari] + neptuPasaran[wetonPasangan.pasaran] : 0;
  const totalNeptu = neptuKamu + neptuPas;

  return (
    <div className="desk-container">
      <h3>Analisis Weton Pasangan</h3>

      {/* Input Tanggal Pasangan */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', marginBottom: '6px', color: '#333' }}>
          <strong>Pasangan =</strong>
        </div>
        <Dtpick value={pasangan} onChange={setPasangan} />
      </div>

      {/* Detail Weton Kamu */}
      {wetonKamu && (
        <div className="weton-section">
          <h4>Weton Anda</h4>
          <div className="weton-grid">
            <div><strong>Tanggal</strong><span>{tanggal}</span></div>
            <div><strong>Hari</strong><span>{wetonKamu.hari}</span></div>
            <div><strong>Pasaran</strong><span>{wetonKamu.pasaran}</span></div>
            <div><strong>Neptu Hari</strong><span>{neptuHari[wetonKamu.hari]}</span></div>
            <div><strong>Neptu Pasaran</strong><span>{neptuPasaran[wetonKamu.pasaran]}</span></div>
            <div className="total"><strong>Total Neptu</strong><span>{neptuKamu}</span></div>
          </div>
        </div>
      )}

      {/* Detail Weton Pasangan */}
      {wetonPasangan && (
        <div className="weton-section">
          <h4>Weton Pasangan</h4>
          <div className="weton-grid">
            <div><strong>Tanggal</strong><span>{pasangan}</span></div>
            <div><strong>Hari</strong><span>{wetonPasangan.hari}</span></div>
            <div><strong>Pasaran</strong><span>{wetonPasangan.pasaran}</span></div>
            <div><strong>Neptu Hari</strong><span>{neptuHari[wetonPasangan.hari]}</span></div>
            <div><strong>Neptu Pasaran</strong><span>{neptuPasaran[wetonPasangan.pasaran]}</span></div>
            <div className="total"><strong>Total Neptu</strong><span>{neptuPas}</span></div>
          </div>
        </div>
      )}

      {/* Total Neptu */}
      <div className="total-neptu">
        <h4>Jumlah Neptu Pasangan</h4>
        <div className="total-box">
          <strong>{neptuKamu} + {neptuPas} = {totalNeptu}</strong>
        </div>
      </div>

      {/* Makna (opsional) */}
      <div className="makna">
        <h4>Makna</h4>
        <p>
          {totalNeptu < 20
            ? 'Neptu rendah, perlu penyesuaian dalam hubungan.'
            : totalNeptu <= 30
            ? 'Neptu seimbang, potensi harmonis.'
            : 'Neptu tinggi, kuat tapi perlu pengendalian.'}
        </p>
      </div>
    </div>
  );
}

// CSS Inline
const style = document.createElement('style');
style.textContent = `
.desk-container {
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
  max-width: 360px;
  margin: 0 auto;
}

.desk-container h3, .weton-section h4 {
  margin-top: 0;
  color: #0078D7;
}

.weton-section {
  margin-bottom: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  background: #f9f9f9;
}

.weton-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  font-size: 14px;
}

.weton-grid > div {
  padding: 8px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
}

.weton-grid strong {
  display: block;
  font-size: 11px;
  color: #555;
  margin-bottom: 4px;
}

.weton-grid .total {
  grid-column: span 2;
  background: #d1ecf1;
  border-color: #bee5eb;
  text-align: center;
}

.total-neptu {
  margin: 20px 0;
  text-align: center;
}

.total-box {
  padding: 12px;
  background: #f0f8ff;
  border: 2px dashed #0078D7;
  border-radius: 8px;
  font-size: 18px;
  color: #0078D7;
  font-weight: 600;
  margin-top: 8px;
}

.makna {
  margin-top: 20px;
  padding: 15px;
  background: #fff8e1;
  border: 1px solid #ffcc80;
  border-radius: 8px;
  font-size: 14px;
  color: #5d4037;
}

.makna h4 {
  margin: 0 0 8px 0;
  color: #e65100;
  font-size: 15px;
}
`;
document.head.appendChild(style);
