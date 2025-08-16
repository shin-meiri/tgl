import React from 'react';

const neptuHari = { 'Senin': 4, 'Selasa': 3, 'Rabu': 7, 'Kamis': 8, 'Jumat': 6, 'Sabtu': 9, 'Minggu': 5 };
const neptuPasaran = { 'Legi': 5, 'Pahing': 9, 'Pon': 7, 'Wage': 4, 'Kliwon': 8 };

const maknaWeton = {
  'Minggu Legi': 'Baik untuk memulai usaha atau perjalanan.',
  'Senin Pahing': 'Hari yang tenang, cocok untuk perencanaan.',
  // Bisa ditambah
};

export default function Desk({ tanggal }) {
  if (!tanggal) {
    return <div className="placeholder">Pilih tanggal untuk melihat detail weton</div>;
  }

  const parts = tanggal.split(' ');
  const day = parseInt(parts[0]);
  const monthName = parts[1];
  const year = parseInt(parts[2]);

  const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const month = monthNames.indexOf(monthName) + 1;

  const hari = hitungHari(day, month, year);
  const pasaran = hitungPasaran(day, month, year);
  const neptuH = neptuHari[hari] || 0;
  const neptuP = neptuPasaran[pasaran] || 0;
  const totalNeptu = neptuH + neptuP;
  const makna = maknaWeton[`${hari} ${pasaran}`] || 'Makna akan segera tersedia.';

  return (
    <div className="desk-container">
      <h3>Detail Weton</h3>
      <div className="weton-grid">
        <div className="item"><strong>Tanggal</strong><span>{tanggal}</span></div>
        <div className="item"><strong>Hari</strong><span>{hari}</span></div>
        <div className="item"><strong>Pasaran</strong><span>{pasaran}</span></div>
        <div className="item"><strong>Neptu Hari</strong><span>{neptuH}</span></div>
        <div className="item"><strong>Neptu Pasaran</strong><span>{neptuP}</span></div>
        <div className="item total"><strong>Total Neptu</strong><span>{totalNeptu}</span></div>
      </div>
      <div className="makna">
        <h4>Makna Weton</h4>
        <p>{makna}</p>
      </div>
    </div>
  );
}

// Fungsi pendukung
function hitungHari(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const baseJDN = 1721425;
  const selisih = jdn - baseJDN;
  const hari = (selisih % 7 + 7) % 7;
  const days = [ 'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[hari];
}

function hitungPasaran(day, month, year) {
  const acuan = { tahun: 1900, bulan: 1, tanggal: 1, pasaranIndex: 0 };
  const targetJDN = julianDayNumber(day, month, year);
  const acuanJDN = julianDayNumber(acuan.tanggal, acuan.bulan, acuan.tahun);
  const selisih = targetJDN - acuanJDN;
  const pasaranIndex = (selisih + acuan.pasaranIndex) % 5;
  const pasaranList = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  return pasaranList[(pasaranIndex + 5) % 5];
}

function julianDayNumber(day, month, year) {
  let y = year, m = month;
  if (month <= 2) { y--; m += 12; }
  let b = 0;
  if (year > 1582 || (year === 1582 && month > 10) || (year === 1582 && month === 10 && day >= 15)) {
    const a = Math.floor(y / 100);
    b = 2 - a + Math.floor(a / 4);
  }
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
}
