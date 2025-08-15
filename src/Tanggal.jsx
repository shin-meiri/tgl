// src/components/Tanggal.jsx
import React from 'react';
import { julianDayNumber } from './History';

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const hariList = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// Fungsi: hitung hari (0=Min, 1=Sen, ..., 6=Sab)
function getDayOfWeek(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const baseJDN = 1721425; // 1 Jan 1 M = Minggu → 1721424 = Sabtu, 1721425 = Minggu
  const selisih = jdn - baseJDN;
  return (selisih % 7 + 7) % 7;
}

// Fungsi: jumlah hari dalam bulan
function getDaysInMonth(month, year) {
  if (month === 1) {
    // Cek kabisat
    if (year < 1582) {
      return year % 4 === 0 ? 29 : 28;
    } else {
      return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
    }
  }
  const days = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month];
}

export default function Tanggal({ tanggal }) {
  // Parse tanggal: "31 Agustus 622"
  const parts = tanggal.split(' ');
  const day = parseInt(parts[0]);
  const month = bulanList.indexOf(parts[1]);
  const year = parseInt(parts[2]);

  const totalDays = getDaysInMonth(month, year);
  const firstDay = getDayOfWeek(1, month + 1, year); // 0=Min, 6=Sab

  // Buat grid tanggal
  const rows = [];
  let date = 1;
  let isAfter = false;

  for (let i = 0; i < 6; i++) {
    const cells = [];

    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cells.push(<div key={`empty-${j}`} className="cal-cell empty"></div>);
      } else if (date > totalDays) {
        cells.push(<div key={`empty-end-${j}`} className="cal-cell empty"></div>);
      } else {
        const isToday = date === day && month === new Date().getMonth() && year === new Date().getFullYear();
        const isSelected = date === day;

        cells.push(
          <div
            key={date}
            className={`cal-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          >
            {date}
          </div>
        );
        date++;
      }
    }

    rows.push(
      <div key={i} className="cal-row">
        {cells}
      </div>
    );

    if (date > totalDays) break;
  }

  return (
    <div className="calendar-container">
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
    </div>
  );
}

// CSS Inline (bisa dipindah ke file .css nanti)
const style = document.createElement('style');
style.textContent = `
.calendar-container {
  width: 300px;
  font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background: white;
}

.calendar-header {
  background: #0078D7;
  color: white;
  text-align: center;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

.cal-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 14px;
  cursor: default;
  user-select: none;
}

.cal-cell.weekday {
  font-weight: 600;
  color: #555;
  font-size: 12px;
  padding: 8px 0;
}

.calendar-body {
  display: flex;
  flex-direction: column;
}

.cal-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.cal-cell.empty {
  background: transparent;
}

.cal-cell:hover:not(.empty) {
  background: #f5f5f5;
}

.cal-cell.selected {
  background: #0078D7;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin: 0 auto;
}

.cal-cell.today {
  border: 2px solid #0078D7;
  border-radius: 50%;
  font-weight: bold;
}
`;
document.head.appendChild(style);
