// src/components/Kalender.jsx
import React, { useState, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidays, setHolidays] = useState({}); // { '2025-08-17': 'Hari Kemerdekaan' }

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']; // Singkat agar muat di HP

  // Ambil libur dari API
  React.useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch(`https://namasite.infinityfreeapp.com/libur.php?year=${currentYear}&month=${currentMonth + 1}`);
        const data = await res.json();
        if (data.success) {
          const holidayMap = {};
          data.data.forEach(h => {
            holidayMap[h.tanggal] = h.nama;
          });
          setHolidays(holidayMap);
        }
      } catch (err) {
        console.error('Gagal ambil libur:', err);
      }
    };

    fetchHolidays();
  }, [currentYear, currentMonth]);

  // Generate hari
  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const result = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      result.push({ date: prevMonthDays - i, isCurrent: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      result.push({
        date: i,
        isCurrent: true,
        isHoliday: !!holidays[dateStr]
      });
    }

    const totalCells = Math.ceil(result.length / 7) * 7;
    for (let i = result.length; i < totalCells; i++) {
      result.push({ date: i - result.length + 1, isCurrent: false });
    }

    return result;
  }, [currentMonth, currentYear, holidays]);

  const handleChange = (dateArray) => {
    setSelectedDate(dateArray[0]);
  };

  return (
    <div className="calendar-container">
      {/* Navigasi */}
      <Flatpickr
        value={selectedDate}
        onChange={handleChange}
        options={{
          dateFormat: 'Y-m-d',
          altFormat: 'F Y',
          clickOpens: true,
          monthSelectorType: 'dropdown',
          yearSelectorType: 'dropdown',
          locale: {
            firstDayOfWeek: 1,
            weekdays: { shorthand: ['Min','Sen','Sel','Rab','Kam','Jum','Sab'] },
            months: {
              longhand: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
            }
          },
          inline: false
        }}
        className="flatpickr-input"
      />

      {/* Tabel Responsif — Scroll Horizontal di HP */}
      <div className="calendar-wrapper">
        <table>
          <thead>
            <tr>
              {weekDays.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(days.length / 7) }).map((_, week) => {
              const start = week * 7;
              const weekDays = days.slice(start, start + 7);
              return (
                <tr key={week}>
                  {weekDays.map((day, idx) => {
                    const dateStr = day.isCurrent
                      ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`
                      : '';

                    return (
                      <td
                        key={idx}
                        className={[
                          day.isCurrent ? 'current-month' : 'other-month',
                          day.isHoliday ? 'holiday' : ''
                        ].filter(Boolean).join(' ')}
                        title={day.isHoliday ? holidays[dateStr] : ''}
                      >
                        <div className="date-cell">
                          {day.date}
                          {day.isHoliday && <div className="dot"></div>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Kalender;
