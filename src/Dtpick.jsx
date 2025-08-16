import React, { useState } from 'react';
import { getDaysInMonth, julianDayNumber } from './History';

const bulanList = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const hariList = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

function getDayOfWeek(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const baseJDN = 1721425;
  return (jdn - baseJDN) % 7;
}

export default function Dtpick({ value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const parse = () => {
    const parts = value.split(' ');
    return {
      day: parseInt(parts[0]),
      month: bulanList.indexOf(parts[1]),
      year: parseInt(parts[2])
    };
  };

  const { day: selectedDay, month: selectedMonth, year: selectedYear } = parse();
  const [viewMonth, setViewMonth] = useState(selectedMonth);
  const [viewYear, setViewYear] = useState(selectedYear);

  const selectDate = (day) => {
    const tglStr = `${day} ${bulanList[viewMonth]} ${viewYear}`;
    onChange(tglStr);
    setShowPicker(false);
  };

  const firstDay = getDayOfWeek(1, viewMonth + 1, viewYear);
  const totalDays = getDaysInMonth(viewMonth, viewYear);

  const renderDays = () => {
    const grid = [];
    for (let i = 0; i < firstDay; i++) {
      grid.push(<div key={`e-${i}`} className="cal-cell empty"></div>);
    }
    for (let d = 1; d <= totalDays; d++) {
      const isActive = d === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;
      grid.push(
        <div
          key={d}
          onClick={() => selectDate(d)}
          className={`cal-cell ${isActive ? 'selected' : ''}`}
        >
          {d}
        </div>
      );
    }
    return grid;
  };

  return (
    <input
      type="text"
      value={value}
      readOnly
      onClick={() => {
        setViewMonth(selectedMonth);
        setViewYear(selectedYear);
        setShowPicker(true);
      }}
      className="datepicker-input"
    />
  );
      }
