import React, { useEffect, useState } from 'react';
import { getDaysInMonth, julianDayNumber } from './History';

const bulanList = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const hariList = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const pasaranList = ['Legi','Pahing','Pon','Wage','Kliwon'];

const ACUAN = { tahun: 1900, bulan: 1, tanggal: 1, pasaranIndex: 0 };

function hitungPasaran(t, b, t) {
  const jdn = julianDayNumber(t, b, t);
  const acuan = julianDayNumber(ACUAN.tanggal, ACUAN.bulan, ACUAN.tahun);
  const selisih = jdn - acuan;
  return pasaranList[(selisih + ACUAN.pasaranIndex) % 5];
}

function getDayOfWeek(d, m, y) {
  const jdn = julianDayNumber(d, m, y);
  return (jdn - 1721425) % 7;
}

export default function Tanggal({ tanggal, onTanggalClick }) {
  const [libur, setLibur] = useState([]);
  const parts = tanggal.split(' ');
  const month = bulanList.indexOf(parts[1]);
  const year = parseInt(parts[2]);

  useEffect(() => {
    fetch('https://namadomain.epizy.com/api/libur.php')
      .then(r => r.json())
      .then(d => setLibur(d.success ? d.data : []))
      .catch(() => setLibur([]));
  }, []);

  const totalDays = getDaysInMonth(month, year);
  const firstDay = getDayOfWeek(1, month + 1, year);
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
        const fmt = `${year}-${String(month+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
        const isLibur = liburSet.has(fmt);
        const tglStr = `${date} ${bulanList[month]} ${year}`;
        const pasaran = hitungPasaran(date, month + 1, year);

        cells.push(
          <div
            key={date}
            className="cal-cell"
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

  const liburBulanIni = libur.filter(l => l.tanggal.startsWith(`${year}-${String(month+1).padStart(2,'0')}`));

  return (
    <div className="calendar-month-view">
      <div className="calendar-header">{bulanList[month]} {year}</div>
      <div className="calendar-weekdays">{hariList.map(h => <div key={h} className="cal-cell weekday">{h}</div>)}</div>
      <div className="calendar-body">{rows}</div>
      <div className="daftar-libur">
        <strong>Libur {bulanList[month]} {year}:</strong>
        {liburBulanIni.length ? liburBulanIni.map((l, i) => <p key={i}>{l.tanggal}: {l.nama}</p>) : <p>Tidak ada</p>}
      </div>
    </div>
  );
  }
