// src/components/Tanggal.jsx
import React, { useEffect, useState } from 'react';
import { julianDayNumber, getDaysInMonth } from '../utils/History';

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const hariList = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const pasaranList = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

// 🔧 Kalibrasi weton
const ACUAN = {
  tahun: 1900,
  bulan: 1,
  tanggal: 1,
  pasaranIndex: 0 // 1 Jan 1900 = Legi
};

function hitungPasaran(tanggal, bulan, tahun) {
  const targetJDN = julianDayNumber(tanggal, bulan, tahun);
  const acuanJDN = julianDayNumber(ACUAN.tanggal, ACUAN.bulan, ACUAN.tahun);
  const selisih = targetJDN - acuanJDN;
  const index = (selisih + ACUAN.pasaranIndex) % 5;
  return pasaranList[(index + 5) % 5];
}

function getDayOfWeek(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const baseJDN = 1721425; // 1 Jan 1 M = Minggu
  return (jdn - baseJDN) % 7;
}

function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatTampil(tanggal, bulan, tahun) {
  return `${tanggal} ${bulanList[bulan - 1]} ${tahun}`;
}

export default function Tanggal({ tanggal, onTanggalClick }) {
  const [libur, setLibur] = useState([]);

  // ✅ Ambil libur dari API — tetap jalan
  useEffect(() => {
    fetch('https://namadomain.epizy.com/api/libur.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setLibur(data.data);
        } else {
          setLibur([]);
        }
      })
      .catch(err => {
        console.error('Gagal ambil libur:', err);
        setLibur([]);
      });
  }, []);

  const parts = tanggal.split(' ');
  const selectedDay = parseInt(parts[0]);
  const month = bulanList.indexOf(parts[1]);
  const year = parseInt(parts[2]);

  const totalDays = getDaysInMonth(month, year);
  const firstDay = getDayOfWeek(1, month + 1, year);

  const liburSet = new Set(libur.map(l => l.tanggal));

  const rows = [];
  let date = 1;

  for (let i = 0; i < 6; i++) {
    const cells = [];

    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cells.push(<div key={`empty-${j}`} className="cal-cell empty"></div>);
      } else if (date > totalDays) {
        cells.push(<div key={`empty-end-${j}`} className="cal-cell empty"></div>);
      } else {
        const isMinggu = j === 0;
        const currentFormattedDate = formatDate(year, month + 1, date);
        const isLibur = liburSet.has(currentFormattedDate);
        const isToday = date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
        const isSelected = date === selectedDay;
        const pasaran = hitungPasaran(date, month + 1, year);

        const tglStr = `${date} ${bulanList[month]} ${year}`;

        cells.push(
          <div
            key={date}
            className={`cal-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
            style={{ color: isMinggu || isLibur ? '#d32f2f' : 'inherit', cursor: 'pointer' }}
            title={isLibur ? libur.find(l => l.tanggal === currentFormattedDate)?.nama : ''}
            onClick={() => onTanggalClick?.(tglStr)} // 🔥 Klik → pindah tab
          >
            <div className="date-num">{date}</div>
            <div className="pasaran">{pasaran}</div>
          </div>
        );
        date++;
      }
    }

    rows.push(<div key={i} className="cal-row">{cells}</div>);

    if (date > totalDays) break;
  }

  // ✅ Filter libur di bulan ini
  const liburBulanIni = libur.filter(item => {
    const [y, m] = item.tanggal.split('-').map(Number);
    return y === year && m === month + 1;
  });

  return (
    <div className="calendar-month-view">
      <div className="calendar-header">
        {bulanList[month]} {year}
      </div>

      <div className="calendar-weekdays">
        {hariList.map(hari => (
          <div key={hari} className="cal-cell weekday">
            {hari}
          </div>
        ))}
      </div>

      <div className="calendar-body">
        {rows}
      </div>

      {/* ✅ Daftar libur di bawah tetap muncul */}
      {liburBulanIni.length > 0 ? (
        <div className="daftar-libur">
          <strong>Libur {bulanList[month]} {year}:</strong>
          {liburBulanIni.map((item, idx) => {
            const [y, m, d] = item.tanggal.split('-');
            const tglTampil = formatTampil(parseInt(d), parseInt(m), parseInt(y));
            return (
              <p key={idx} style={{ margin: '4px 0', fontSize: '13px' }}>
                <span style={{ fontWeight: 'bold' }}>{tglTampil}</span>: {item.nama}
              </p>
            );
          })}
        </div>
      ) : (
        <div className="daftar-libur" style={{ fontSize: '13px', color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '8px 0' }}>
          Tidak ada libur di {bulanList[month]} {year}
        </div>
      )}
    </div>
  );
}

// CSS (sudah termasuk warna merah untuk Minggu & libur)
const style = document.createElement('style');
style.textContent = `
.calendar-month-view {
  width: 320px;
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  background: white;
}
.calendar-header {
  background: #0078D7;
  color: white;
  text-align: center;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
}
.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
}
.cal-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50px;
  font-size: 13px;
  user-select: none;
  cursor: pointer;
}
.cal-cell.weekday {
  font-weight: 600;
  color: #555;
  font-size: 12px;
  padding: 6px 0;
}
.cal-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.cal-cell.empty {
  background: transparent;
}
.cal-cell:hover:not(.empty) {
  background: #f0f0f0;
}
.cal-cell.selected {
  background: #0078D7;
  color: white;
}
.cal-cell.today {
  border: 1.5px solid #0078D7;
  border-radius: 4px;
}
.date-num {
  font-weight: 600;
  font-size: 14px;
}
.pasaran {
  font-size: 11px;
  margin-top: 2px;
  opacity: 0.8;
}
.daftar-libur {
  padding: 10px 15px;
  background: #fff8f8;
  border-top: 1px dashed #ddd;
  font-size: 13px;
  color: #d32f2f;
}
.daftar-libur strong {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
}
`;
document.head.appendChild(style);
