// src/components/Tanggal.jsx
import React, { useEffect, useState } from 'react';
import { julianDayNumber } from './History';

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const hariList = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const pasaranList = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

// 🔧 Titik kalibrasi weton
const ACUAN = {
  tahun: 1900,
  bulan: 1,
  tanggal: 1,
  pasaranIndex: 1 // 1 Jan 1900 = Legi
};

function hitungPasaran(tanggal, bulan, tahun) {
  const targetJDN = julianDayNumber(tanggal, bulan, tahun);
  const acuanJDN = julianDayNumber(ACUAN.tanggal, ACUAN.bulan, ACUAN.tahun);
  const selisih = targetJDN - acuanJDN;
  const index = (selisih + ACUAN.pasaranIndex) % 5;
  return pasaranList[(index + 5) % 5];
}

function getDaysInMonth(month, year) {
  if (month === 1) {
    if (year < 1582) return year % 4 === 0 ? 29 : 28;
    return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  }
  const days = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month];
}

function getDayOfWeek(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const baseJDN = 1721425; // 1 Jan 1 M = Minggu
  return (jdn - baseJDN) % 7;
}

export default function Tanggal({ tanggal }) {
  const [libur, setLibur] = useState([]);

  const parts = tanggal.split(' ');
  const selectedDay = parseInt(parts[0]);
  const month = bulanList.indexOf(parts[1]);
  const year = parseInt(parts[2]);

  // Ambil libur dari API
  useEffect(() => {
    fetch(`/api/libur.php`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('API Error:', data.error);
          setLibur([]);
        } else {
          setLibur(data);
        }
      })
      .catch(err => {
        console.error('Fetch Error:', err);
        setLibur([]);
      });
  }, [year]);

  // Buat set tanggal libur untuk cepat cek
  const liburSet = new Set(libur.map(l => l.tanggal)); // Format: "2024-12-25"

  const totalDays = getDaysInMonth(month, year);
  const firstDay = getDayOfWeek(1, month + 1, year);

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
        const isToday = date === new Date().getDate() &&
                        month === new Date().getMonth() &&
                        year === new Date().getFullYear();
        const isSelected = date === selectedDay;

        // Format YYYY-MM-DD untuk cek libur
        const formattedDate = `${String(year).padStart(4, '0')}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        const isLibur = liburSet.has(formattedDate);
        const isMinggu = j === 0; // Minggu = kolom pertama
        const pasaran = hitungPasaran(date, month + 1, year);

        cells.push(
          <div
            key={date}
            className={`cal-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
            style={{
              color: isMinggu || isLibur ? 'red' : 'black'
            }}
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

  return (
    <div className="calendar-month-view">
      <div className="calendar-header">
        {bulanList[month]} {year}
      </div>

      <div className="calendar-weekdays">
        {hariList.map(hari => (
          <div key={hari} className="cal-cell weekday" style={{ color: hari === 'Min' ? 'red' : 'inherit' }}>
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

// CSS (sudah termasuk warna merah untuk Minggu & libur)
const style = document.createElement('style');
style.textContent = `
.calendar-month-view {
  width: 320px;
  font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  background: white;
  margin: 0 auto;
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
  cursor: default;
}

.cal-cell.weekday {
  font-weight: 600;
  color: #555;
  font-size: 12px;
  padding: 6px 0;
}

.cal-cell.weekday:nth-child(1) {
  color: red;
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
`;
document.head.appendChild(style);
