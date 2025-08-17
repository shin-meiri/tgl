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

  // Parse dan konversi
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

  // Hitung hari pertama bulan Hijriyah
  const firstJd = julianDayNumber(1, hijri.month, hijri.year);
  const firstDayOfWeek = (firstJd - 1721428) % 7; // 0 = Minggu

  // JDN hari ini
  const today = new Date();
  const todayJd = julianDayNumber(
    today.getDate(),
    today.getMonth() + 1,
    today.getFullYear()
  );

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
        // Hitung JDN tanggal ini
        const thisJd = firstJd + date - 1;
        const isToday = thisJd === todayJd;
        const todayClass = isToday ? 'today' : '';
        cells.push(
          <div key={date} className={`hijri-cell ${todayClass}`}>
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

        <div style={{ marginTop: '10px', fontSize: '14px', color: '#555', textAlign: 'center' }}>
          {tanggal} = {hijri.day} {bulanHijriyah[hijri.month - 1]} {hijri.year} H
        </div>
      </div>
    </div>
  );
}

// Fungsi bantuan: Julian Day Number
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
.hijri-cell.today {
  background: #2e7d32 !important;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin: 0 auto;
}
`;
document.head.appendChild(style);
