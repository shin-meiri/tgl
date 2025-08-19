// src/components/Desk.jsx
import React, { useState } from 'react';
import Dtpick from './Dtpick';

// Neptu Hari & Pasaran
const neptuHari = {
  'Senin': 4,
  'Selasa': 3,
  'Rabu': 7,
  'Kamis': 8,
  'Jumat': 6,
  'Sabtu': 9,
  'Minggu': 5,
};

const neptuPasaran = {
  'Legi': 5,
  'Pahing': 9,
  'Pon': 7,
  'Wage': 4,
  'Kliwon': 8,
};

// Makna umum (opsional)
const maknaWeton = {
  'Minggu Legi': 'Baik untuk memulai usaha, pernikahan, atau perjalanan.',
  'Senin Pahing': 'Hari yang tenang, cocok untuk meditasi dan perencanaan.',
  // Bisa dikembangkan
};

export default function Desk({ tanggal }) {
  const [pasangan, setPasangan] = useState('1 Januari 1990'); // Default

  if (!tanggal) {
    return (
      <div className="desk-container">
        <p className="placeholder">Pilih tanggal untuk melihat detail weton</p>
      </div>
    );
  }

  // Parse tanggal Anda
  const anda = parseTanggal(tanggal);
  const hariAnda = hitungHari(andu.day, andu.month, andu.year);
  const pasaranAnda = hitungPasaran(andu.day, andu.month, andu.year);
  const neptuHariAnda = neptuHari[hariAnda] || 0;
  const neptuPasaranAnda = neptuPasaran[pasaranAnda] || 0;
  const totalNeptuAnda = neptuHariAnda + neptuPasaranAnda;

  // Parse tanggal pasangan
  const andu = parseTanggal(pasangan);
  const hariPasangan = hitungHari(andu.day, andu.month, andu.year);
  const pasaranPasangan = hitungPasaran(andu.day, andu.month, andu.year);
  const neptuHariPasangan = neptuHari[hariPasangan] || 0;
  const neptuPasaranPasangan = neptuPasaran[pasaranPasangan] || 0;
  const totalNeptuPasangan = neptuHariPasangan + neptuPasaranPasangan;

  const totalGabungan = totalNeptuAnda + totalNeptuPasangan;

  return (
    <div className="desk-container">
      <h3>Detail Weton</h3>

      {/* Anda */}
      <div className="section">
        <h4>Anda: {tanggal}</h4>
        <div className="weton-grid">
          <div className="item"><strong>Hari</strong><span>{hariAnda}</span></div>
          <div className="item"><strong>Pasaran</strong><span>{pasaranAnda}</span></div>
          <div className="item"><strong>Neptu Hari</strong><span>{neptuHariAnda}</span></div>
          <div className="item"><strong>Neptu Pasaran</strong><span>{neptuPasaranAnda}</span></div>
          <div className="item total"><strong>Total Neptu</strong><span>{totalNeptuAnda}</span></div>
        </div>
      </div>

      <hr className="divider" />

      {/* Pasangan */}
      <div className="section">
        <h4>Pasangan</h4>
        <div style={{ marginBottom: '12px' }}>
          <Dtpick value={pasangan} onChange={setPasangan} />
        </div>
        <div className="weton-grid">
          <div className="item"><strong>Hari</strong><span>{hariPasangan}</span></div>
          <div className="item"><strong>Pasaran</strong><span>{pasaranPasangan}</span></div>
          <div className="item"><strong>Neptu Hari</strong><span>{neptuHariPasangan}</span></div>
          <div className="item"><strong>Neptu Pasaran</strong><span>{neptuPasaranPasangan}</span></div>
          <div className="item total"><strong>Total Neptu</strong><span>{totalNeptuPasangan}</span></div>
        </div>
      </div>

      <hr className="divider" />

      {/* Jumlah Neptu Pasangan */}
      <div className="summary">
        <h4>Jumlah Neptu Pasangan</h4>
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0078D7' }}>
          {totalGabungan}
        </p>
      </div>
    </div>
  );
}

// Fungsi: parse string tanggal
function parseTanggal(tanggalStr) {
  const parts = tanggalStr.split(' ');
  return {
    day: parseInt(parts[0], 10),
    month: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].indexOf(parts[1]) + 1,
    year: parseInt(parts[2], 10)
  };
}

// Fungsi: hitung hari
function hitungHari(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const baseJDN = 1721424; // 1 Jan 1 M = Senin
  const selisih = jdn - baseJDN;
  const hari = (selisih % 7 + 7) % 7;
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  return days[hari];
}

// Fungsi: hitung pasaran
function hitungPasaran(day, month, year) {
  const acuan = { tahun: 1900, bulan: 1, tanggal: 1, pasaranIndex: 0 }; // 1 Jan 1900 = Legi
  const targetJDN = julianDayNumber(day, month, year);
  const acuanJDN = julianDayNumber(acuan.tanggal, acuan.bulan, acuan.tahun);
  const selisih = targetJDN - acuanJDN;
  const pasaranIndex = (selisih + acuan.pasaranIndex) % 5;
  const pasaranList = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  return pasaranList[(pasaranIndex + 5) % 5];
}

// Fungsi: Julian Day Number
function julianDayNumber(day, month, year) {
  let y = year;
  let m = month;
  if (month <= 2) {
    y -= 1;
    m += 12;
  }
  let b;
  if (year > 1582 || (year === 1582 && month > 10) || (year === 1582 && month === 10 && day >= 15)) {
    const a = Math.floor(y / 100);
    b = 2 - a + Math.floor(a / 4);
  } else {
    b = 0;
  }
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
}

// CSS
const style = document.createElement('style');
style.textContent = `
.desk-container {
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

.desk-container h3 {
  margin-top: 0;
  color: #0078D7;
  border-bottom: 2px solid #0078D7;
  padding-bottom: 8px;
  font-size: 18px;
}

.section {
  margin: 20px 0;
}

.section h4 {
  margin: 0 0 12px 0;
  color: #005a9e;
  font-size: 16px;
}

.weton-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.item {
  padding: 10px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
}

.item strong {
  display: block;
  font-size: 12px;
  color: #555;
  margin-bottom: 4px;
}

.item.total {
  grid-column: span 2;
  background: #d1ecf1;
  border-color: #bee5eb;
  text-align: center;
}

.item.total span {
  font-size: 18px;
  font-weight: bold;
  color: #0c5460;
}

.divider {
  border: none;
  border-top: 1px dashed #ccc;
  margin: 20px 0;
}

.summary {
  text-align: center;
  padding: 15px;
  background: #fff8e1;
  border: 1px solid #ffcc80;
  border-radius: 8px;
  font-size: 14px;
  color: #5d4037;
}

.summary h4 {
  margin: 0 0 8px 0;
  color: #e65100;
  font-size: 15px;
}
`;
document.head.appendChild(style);
