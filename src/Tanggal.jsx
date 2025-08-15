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
  const baseJDN = 1721425; // 1 Jan 1 M = Minggu
  const selisih = jdn - baseJDN;
  return (selisih % 7 + 7) % 7; // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
}

// Fungsi: jumlah hari dalam bulan
function getDaysInMonth(month, year) {
  if (month === 1) {
    // Februari
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
  // Parse: "31 Agustus 622"
  const parts = tanggal.split(' ');
  const selectedDay = parseInt(parts[0]);
  const month = bulanList.indexOf(parts[1]);
  const year = parseInt(parts[2]);

  const totalDays = getDaysInMonth(month, year);
  const firstDay = getDayOfWeek(1, month + 1, year); // 0 = Minggu

  const rows = [];
  let date = 1;

  for (let i = 0; i < 6; i++) {
    const cells = [];

    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cells.push(<div key={`empty-${i}-${j}`} className="cal-cell empty"></div>);
      } else if (date > totalDays) {
        cells.push(<div key={`empty-end-${j}`} className="cal-cell empty"></div>);
      } else {
        const isToday = date === new Date().getDate() &&
                        month === new Date().getMonth() &&
                        year === new Date().getFullYear();
        const isSelected = date === selectedDay;

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

    rows.push(<div key={i} className="cal-row">{cells}</div>);

    if (date > totalDays) break;
  }

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
    </div>
  );
}

// CSS Inline (bisa dipindah ke .css file)
const style = document.createElement('style');
style.textContent = `
.calendar-month-view {
  width: 280px;
  font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
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
  align-items: center;
  justify-content: center;
  height: 36px;
  font-size: 13px;
  color: #333;
  user-select: none;
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

.cal-cell:hover:not(.empty):not(.selected) {
  background: #f0f0f0;
}

.cal-cell.selected {
  background: #0078D7;
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  margin: 0 auto;
  font-weight: 600;
}

.cal-cell.today {
  border: 1.5px solid #0078D7;
  border-radius: 50%;
  font-weight: 600;
}
`;
document.head.appendChild(style);
