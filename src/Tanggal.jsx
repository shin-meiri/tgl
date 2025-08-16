import React, { useEffect, useState } from 'react';
import { julianDayNumber, getDaysInMonth } from './History';

const bulanList = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const hariList = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const pasaranList = ['Legi','Pahing','Pon','Wage','Kliwon'];

const ACUAN = { tahun: 1900, bulan: 1, tanggal: 1, pasaranIndex: 1 };

function hitungPasaran(t, b, y) {
  const jdn = julianDayNumber(t, b, y);
  const acuanJDN = julianDayNumber(ACUAN.tanggal, ACUAN.bulan, ACUAN.tahun);
  const selisih = jdn - acuanJDN;
  return pasaranList[(selisih + ACUAN.pasaranIndex) % 5];
}

function getDayOfWeek(d, m, y) {
  const jdn = julianDayNumber(d, m, y);
  return (jdn - 1721425) % 7;
}

function formatDate(y, m, d) {
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function formatTampil(t, b, y) {
  return `${t} ${bulanList[b-1]} ${y}`;
}

export default function Tanggal({ tanggal, onTanggalClick }) {
  const [libur, setLibur] = useState([]);

  useEffect(() => {
    fetch('/api/libur.php')
      .then(r => r.json())
      .then(d => setLibur(d.success ? d.data : []))
      .catch(e => setLibur([]));
  }, []);

  const [day, monthName, year] = tanggal.split(' ');
  const month = bulanList.indexOf(monthName);
  const yearNum = parseInt(year);
  const dayNum = parseInt(day);

  const totalDays = getDaysInMonth(month, yearNum);
  const firstDay = getDayOfWeek(1, month + 1, yearNum);
  const liburSet = new Set(libur.map(l => l.tanggal));

  const rows = [];
  let date = 1;

  for (let i = 0; i < 6; i++) {
    const cells = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        cells.push(<div key={j} className="cal-cell empty"></div>);
      } else if (date > totalDays) {
        cells.push(<div key={`e${j}`} className="cal-cell empty"></div>);
      } else {
        const isMinggu = j === 0;
        const current = formatDate(yearNum, month + 1, date);
        const isLibur = liburSet.has(current);
        const isToday = date === new Date().getDate() && month === new Date().getMonth() && yearNum === new Date().getFullYear();
        const isSelected = date === dayNum;
        const pasaran = hitungPasaran(date, month + 1, yearNum);
        const tglStr = `${date} ${bulanList[month]} ${yearNum}`;

        cells.push(
          <div
            key={date}
            className={`cal-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
            style={{ color: isMinggu || isLibur ? '#d32f2f' : 'inherit' }}
            onClick={() => onTanggalClick(tglStr)}
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

  const liburBulanIni = libur.filter(l => {
    const [y, m] = l.tanggal.split('-').map(Number);
    return y === yearNum && m === month + 1;
  });

  return (
    <div className="calendar-month-view">
      <div className="calendar-header">{bulanList[month]} {yearNum}</div>
      <div className="calendar-weekdays">
        {hariList.map(h => <div key={h} className="cal-cell weekday">{h}</div>)}
      </div>
      <div className="calendar-body">{rows}</div>
      <div className="daftar-libur">
        <strong>Libur {bulanList[month]} {yearNum}:</strong>
        {liburBulanIni.length > 0 ? liburBulanIni.map((l, i) => {
          const [y, m, d] = l.tanggal.split('-');
          const t = formatTampil(parseInt(d), parseInt(m), parseInt(y));
          return <p key={i}><b>{t}</b>: {l.nama}</p>;
        }) : <p>Tidak ada libur</p>}
      </div>
    </div>
  );
                                }
