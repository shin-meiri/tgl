// src/components/Kalender.jsx
import React, { useState, useMemo, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']; // Agar muat di HP

  // Ambil libur dari API
  useEffect(() => {
    fetch('https://namasite.infinityfreeapp.com/libur.php') // Ganti domain
      .then(r => r.json())
      .then(data => {
        if (data.success) setHolidays(data.data);
      })
      .catch(err => console.error('Gagal ambil libur:', err));
  }, []);

  // Cek apakah tanggal adalah libur
  const isHoliday = (date) => {
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return holidays.find(h => h.date === dateString);
  };

  // Generate hari
  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const result = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      result.push({ date: prevMonthDays - i, isCurrent: false, fullDate: new Date(currentYear, currentMonth - 1, prevMonthDays - i) });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const fullDate = new Date(currentYear, currentMonth, i);
      result.push({ date: i, isCurrent: true, fullDate });
    }

    const totalCells = Math.ceil(result.length / 7) * 7;
    for (let i = result.length; i < totalCells; i++) {
      result.push({ date: i - result.length + 1, isCurrent: false, fullDate: new Date(currentYear, currentMonth + 1, i - result.length + 1) });
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
            weekdays: { shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] },
            months: {
              longhand: [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
              ],
            },
          },
          allowInput: false,
        }}
        className="flatpickr-input"
        placeholder="Pilih bulan..."
      />

      {/* Kalender Responsif */}
      <div className="calendar-wrapper">
        <table>
          <thead>
            <tr>
              {weekDays.map(day => (
                <th key={day} className="day-header">{day}</th>
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
                    const holiday = isHoliday(day.fullDate);
                    return (
                      <td
                        key={idx}
                        className={`
                          ${day.isCurrent ? 'current-month' : 'other-month'}
                          ${holiday ? 'holiday' : ''}
                        `}
                      >
                        <div className="date-cell">
                          {day.date}
                          {holiday && <div className="holiday-dot"></div>}
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

      {/* Keterangan Libur */}
      <div className="holiday-legend">
        <div className="legend-item">
          <span className="legend-dot holiday"></span>
          <span>Hari Libur Nasional</span>
        </div>
      </div>
    </div>
  );
};

export default Kalender;
