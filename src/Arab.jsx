// src/components/Arab.jsx
import React, { useState, useEffect } from 'react';
import Dtpick from './Dtpick';
import { masehiToHijri, getHijriDaysInMonth, bulanHijriyah } from './HijriConverter';

export default function Arab() {
  const now = new Date();
  const defaultDay = now.getDate();
  const defaultMonth = now.getMonth();
  const defaultYear = now.getFullYear();

  const [tanggal, setTanggal] = useState(`${defaultDay} ${['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][defaultMonth]} ${defaultYear}`);
  const [hijri, setHijri] = useState(null);

  // Parse dan konversi tanggal yang dipilih
  useEffect(() => {
    const parts = tanggal.split(' ');
    const day = parseInt(parts[0], 10);
    const month = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].indexOf(parts[1]);
    const year = parseInt(parts[2], 10);

    const h = masehiToHijri(day, month + 1, year);
    setHijri(h);
  }, [tanggal]);

  if (!hijri) return <div></div>;

  const totalDays = getHijriDaysInMonth(hijri.month, hijri.year);

  // 🔹 Hitung hari pertama bulan Hijriyah (untuk grid)
  const firstDayOfWeek = getFirstDayOfHijriMonth(hijri.month, hijri.year);

  // 🔹 Konversi hari ini (Masehi) ke Hijriyah
  const today = new Date();
  const todayHijri = masehiToHijri(
    today.getDate(),
    today.getMonth() + 1,
    today.getFullYear()
  );

  // 🔹 Apakah bulan yang tampil = bulan hari ini (Hijriyah)?
  const isCurrentHijriMonth = hijri.month === todayHijri.month && hijri.year === todayHijri.year;

  const rows = [];
  let date = 1;

  for (let i = 0; i < 6; i++) {
    const cells = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayOfWeek) {
        cells.push(<div key={`empty-${j}`} className="hijri-cell empty"></div>);
      } else if (date > totalDays) {
        cells.push(<div key={`empty-end-${j}`} className="hijri-cell empty"></div>);
      } else {
        // 🔹 Apakah ini hari ini?
        const isToday = isCurrentHijriMonth && date === todayHijri.day;

        // Tentukan hari dalam seminggu
        const dayOfWeek = (firstDayOfWeek + date - 1) % 7; // 0 = Minggu

        let className = 'hijri-cell';
        if (isToday) {
          className += ' today'; // biru muda
        } else if (dayOfWeek === 0) {
          className += ' minggu'; // merah
        } else if (dayOfWeek === 5) {
          className += ' jumat'; // hijau muda
        }

        cells.push(
          <div key={date} className={className}>
            <div className="date-num">{date}</div>
          </div>
        );
        date++;
      }
    }
    rows.push(<div key={i} className="hijri-row">{cells}</div>);
    if (date > totalDays) break;
  }

  return (
    <div>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Dtpick value={tanggal} onChange={setTanggal} />
      </div>

      <div className="hijri-calendar">
        <div className="hijri-header">
          {bulanHijriyah[hijri.month - 1]} {hijri.year} H
        </div>

        <div className="hijri-weekdays">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(hari => (
            <div key={hari} className="hijri-cell weekday">{hari}</div>
          ))}
        </div>

        <div className="hijri-body">
          {rows}
        </div>
      </div>
    </div>
  );
}

// Fungsi: hitung hari pertama bulan Hijriyah (0 = Minggu)
function getFirstDayOfHijriMonth(hijriMonth, hijriYear) {
  // Konversi 1 [hijriMonth] [hijriYear] ke Masehi dulu
  // Kita butuh JDN dari 1 hari itu
  const jdn = getJdnFromHijri(1, hijriMonth, hijriYear);
  return (jdn - 1721425) % 7; // 0 = Minggu
}

// Fungsi: konversi Hijriyah ke JDN (untuk hitung hari)
function getJdnFromHijri(day, month, year) {
  // Gunakan: 1 Muharram 1 H = 16 Juli 622 M (Julian) = JDN 1948340
  const hijriEpochJdn = 1948340;
  const daysSinceEpoch = (year - 1) * 354.367 + (month - 1) * 29.530588853 + (day - 1);
  return Math.floor(hijriEpochJdn + daysSinceEpoch);
}

// Fungsi: Julian Day Number (untuk masehiToHijri)
function julianDayNumber(day, month, year) {
  let y = year;
  let m = month;
  if (month <= 2) {
    y -= 1;
    m += 12;
  }
  let b = 0;
  if (year > 1582 || (year === 1582 && month > 10) || (year === 1582 && month === 10 && day >= 15)) {
    const a = Math.floor(y / 100);
    b = 2 - a + Math.floor(a / 4);
  }
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
}

// CSS Inline
const style = document.createElement('style');
style.textContent = `
.hijri-calendar {
  width: 320px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  background: white;
}

.hijri-header {
  background: #0078D7;
  color: white;
  text-align: center;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
}

.hijri-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.hijri-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50px;
  font-size: 13px;
  user-select: none;
  cursor: default;
}

.hijri-cell.weekday {
  font-weight: 600;
  color: #555;
  font-size: 12px;
  padding: 6px 0;
}

.hijri-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.hijri-cell.empty {
  background: transparent;
}

.hijri-cell:hover:not(.empty):not(.today) {
  background: #f0f0f0;
}

.date-num {
  font-weight: 600;
  font-size: 14px;
}

/* 🔹 Penanda hari ini: biru muda */
.hijri-cell.today {
  background: #e3f2fd;
  color: #1565c0;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin: 0 auto;
  font-weight: 600;
}

/* Minggu: merah */
.hijri-cell.minggu {
  color: #d32f2f;
  font-weight: 600;
}

/* Jumat: hijau muda */
.hijri-cell.jumat {
  color: #388e3c;
  font-weight: 600;
}
`;
document.head.appendChild(style);
