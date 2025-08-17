// src/components/Arab.jsx
import React, { useState, useEffect } from 'react';
import Dtpick from './Dtpick';
import { masehiToHijri, bulanHijriyah } from './HijriConverter';

export default function Arab() {
  const now = new Date();
  const defaultDay = now.getDate();
  const defaultMonth = now.getMonth();
  const defaultYear = now.getFullYear();

  const [tanggal, setTanggal] = useState(`${defaultDay} ${['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][defaultMonth]} ${defaultYear}`);
  const [hijri, setHijri] = useState(null);

  // Parse tanggal Masehi
  const parse = () => {
    const parts = tanggal.split(' ');
    return {
      day: parseInt(parts[0], 10),
      month: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].indexOf(parts[1]),
      year: parseInt(parts[2], 10)
    };
  };

  useEffect(() => {
    const { day, month, year } = parse();
    const h = masehiToHijri(day, month + 1, year);
    setHijri(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tanggal]);

  if (!hijri) return <div>Loading...</div>;

  // Cek apakah kalender yang tampil adalah bulan saat ini (Masehi)
  const { day: todayMasehi, month: monthMasehi, year: yearMasehi } = parse();

  // Hitung jumlah hari di bulan Hijriyah
  let totalDays = hijri.month % 2 === 1 ? 30 : 29;

  // Tahun kabisat Hijriyah: 11 dari 30 tahun
  const kabisatHijriyah = [2, 5, 7, 10, 13, 15, 18, 21, 25, 26, 29];
  const tahunMod = hijri.year % 30;
  if (kabisatHijriyah.includes(tahunMod) && hijri.month === 12) {
    totalDays = 30;
  }

  // Julian Day untuk 1 hari pertama bulan Hijriyah
  const firstJd = julianDayNumber(1, hijri.month, hijri.year);
  const firstDayOfWeek = (firstJd - 1721425) % 7; // 0 = Minggu

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
        // Cek apakah ini hari ini (Masehi == input == hari ini?)
        const isToday = date === hijri.day &&
                       hijri.month === masehiToHijri(todayMasehi, monthMasehi + 1, yearMasehi).month &&
                       hijri.year === masehiToHijri(todayMasehi, monthMasehi + 1, yearMasehi).year;

        cells.push(
          <div key={date} className={`hijri-cell ${isToday ? 'today' : ''}`}>
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
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '360px', margin: '0 auto', padding: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>Kalender Hijriyah</h3>

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

        {/* ✅ Hanya tampilkan tanggal, tanpa "Masehi" dan "Hijriyah" */}
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#555', textAlign: 'center' }}>
          {tanggal} = {hijri.day} {bulanHijriyah[hijri.month - 1]} {hijri.year} H
        </div>
      </div>
    </div>
  );
}

// Fungsi jdToHijri (untuk internal)
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

// CSS Inline — tambah class 'today'
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
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 13px;
  user-select: none;
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

.hijri-cell:hover:not(.empty) {
  background: #f0f0f0;
}

.date-num {
  font-weight: 600;
  font-size: 14px;
}

/* ✅ Highlight hari ini */
.hijri-cell.today {
  background: #0078D7;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
`;
document.head.appendChild(style);
