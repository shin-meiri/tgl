// src/components/Weton.jsx
import React from 'react';

// Daftar pasaran (5 hari)
const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

// 🔧 TITIK ACUAN (INI YANG BISA DIRUBAH UNTUK KALIBRASI)
// Format: [tahun, bulan, tanggal] = pasaranIndex (0=Legi, 1=Pahing, ...)
// Contoh: 1 Januari 1 M = Senin Legi
const acuanTahun = 1;
const acuanBulan = 1;      // Januari
const acuanTanggal = 1;
const acuanPasaranIndex = 0; // 0 = Legi, 1 = Pahing, dst.

// Fungsi: hitung hari Jawa (pasaran) dari tanggal
function hitungPasaran(tanggal, bulan, tahun) {
  const targetJDN = julianDayNumber(tanggal, bulan, tahun);
  const acuanJDN = julianDayNumber(acuanTanggal, acuanBulan, acuanTahun);

  const selisihHari = targetJDN - acuanJDN;
  const pasaranIndex = (selisihHari % 5 + 5) % 5; // 0-4
  return pasaran[pasaranIndex];
}

// Fungsi: Julian Day Number (dari History)
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

export default function Weton({ tanggal }) {
  if (!tanggal) return null;

  // Parse: "31 Agustus 622"
  const parts = tanggal.split(' ');
  const day = parseInt(parts[0]);
  const month = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].indexOf(parts[1]) + 1;
  const year = parseInt(parts[2]);

  const pasaran = hitungPasaran(day, month, year);

  return (
    <div className="weton-display">
      <strong>Weton:</strong> {pasaran}
    </div>
  );
}

// CSS simpel
const style = document.createElement('style');
style.textContent = `
.weton-display {
  margin-top: 8px;
  font-size: 14px;
  color: #d32f2f;
  font-weight: 500;
  text-align: center;
  padding: 6px 0;
  border-top: 1px dashed #ddd;
}
`;
document.head.appendChild(style);
