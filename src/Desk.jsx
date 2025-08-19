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

// Titik acuan kalibrasi weton
const ACUAN = {
  tahun: 1900,
  bulan: 1,
  tanggal: 1,
  pasaranIndex: 1 // 1 Jan 1900 = Legi
};

// Julian Day Number
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

// Hitung hari (Senin - Minggu)
function hitungHari(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const baseJDN = 1721426; // 1 Jan 1 M = Senin
  const selisih = jdn - baseJDN;
  const hari = (selisih % 7 + 7) % 7;
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  return days[hari];
}

// Hitung pasaran (Legi, Pahing, dll)
function hitungPasaran(day, month, year) {
  const targetJDN = julianDayNumber(day, month, year);
  const acuanJDN = julianDayNumber(ACUAN.tanggal, ACUAN.bulan, ACUAN.tahun);
  const selisih = targetJDN - acuanJDN;
  const index = (selisih + ACUAN.pasaranIndex) % 5;
  const pasaranList = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  return pasaranList[(index + 5) % 5];
}

export default function Desk({ tanggal }) {
  const [pasangan, setPasangan] = useState('1 Januari 1990'); // Default

  if (!tanggal) {
    return (
      <div className="desk-container">
        <p className="placeholder">Pilih tanggal untuk melihat detail weton</p>
      </div>
    );
  }

  // Parse tanggal kamu
  const parse = (tglStr) => {
    const parts = tglStr.split(' ');
    return {
      day: parseInt(parts[0]),
      month: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].indexOf(parts[1]) + 1,
      year: parseInt(parts[2])
    };
  };

  const kamu = parse(tanggal);
  const pas = parse(pasangan);

  // Hitung weton kamu
  const hariKamu = hitungHari(kamu.day, kamu.month, kamu.year);
  const pasaranKamu = hitungPasaran(kamu.day, kamu.month, kamu.year);
  const neptuHariKamu = neptuHari[hariKamu] || 0;
  const neptuPasaranKamu = neptuPasaran[pasaranKamu] || 0;
  const totalNeptuKamu = neptuHariKamu + neptuPasaranKamu;

  // Hitung weton pasangan
  const hariPasangan = hitungHari(pas.day, pas.month, pas.year);
  const pasaranPasangan = hitungPasaran(pas.day, pas.month, pas.year);
  const neptuHariPasangan = neptuHari[hariPasangan] || 0;
  const neptuPasaranPasangan = neptuPasaran[pasaranPasangan] || 0;
  const totalNeptuPasangan = neptuHariPasangan + neptuPasaranPasangan;

  // Total gabungan
  const totalGabungan = totalNeptuKamu + totalNeptuPasangan;

  return (
    <div className="desk-container">
      <h3>Detail Weton</h3>

      {/* Weton Kamu */}
      <div className="weton-grid">
        <div className="item">
          <strong>Tanggal</strong>
          <span>{tanggal}</span>
        </div>
        <div className="item">
          <strong>Hari</strong>
          <span>{hariKamu}</span>
        </div>
        <div className="item">
          <strong>Pasaran</strong>
          <span>{pasaranKamu}</span>
        </div>
        <div className="item">
          <strong>Neptu Hari</strong>
          <span>{neptuHariKamu}</span>
        </div>
        <div className="item">
          <strong>Neptu Pasaran</strong>
          <span>{neptuPasaranKamu}</span>
        </div>
        <div className="item total">
          <strong>Total Neptu</strong>
          <span>{totalNeptuKamu}</span>
        </div>
      </div>

      {/* Input Pasangan */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', marginBottom: '8px', color: '#333' }}>
          <strong>Pasangan</strong>
        </div>
        <Dtpick value={pasangan} onChange={setPasangan} />
      </div>

      {/* Weton Pasangan */}
      {pasangan && (
        <div className="weton-grid" style={{ marginTop: '20px' }}>
          <div className="item">
            <strong>Tanggal Pasangan</strong>
            <span>{pasangan}</span>
          </div>
          <div className="item">
            <strong>Hari</strong>
            <span>{hariPasangan}</span>
          </div>
          <div className="item">
            <strong>Pasaran</strong>
            <span>{pasaranPasangan}</span>
          </div>
          <div className="item">
            <strong>Neptu Hari</strong>
            <span>{neptuHariPasangan}</span>
          </div>
          <div className="item">
            <strong>Neptu Pasaran</strong>
            <span>{neptuPasaranPasangan}</span>
          </div>
          <div className="item total">
            <strong>Total Neptu</strong>
            <span>{totalNeptuPasangan}</span>
          </div>
        </div>
      )}

      {/* Total Gabungan */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f0f8ff',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#0078D7'
      }}>
        <strong>Jumlah Neptu Gabungan: {totalGabungan}</strong>
      </div>
    </div>
  );
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

.weton-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 20px 0;
}

.item {
  padding: 12px;
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

.placeholder {
  text-align: center;
  color: #888;
  font-style: italic;
  padding: 40px 20px;
}
`;
document.head.appendChild(style);
