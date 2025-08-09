// src/components/Kalender.jsx
import React, { useState, useMemo, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  useEffect(() => {
    fetch('https://namasite.infinityfreeapp.com/libur.php')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setHolidays(data.data);
      })
      .catch((err) => console.error('Gagal ambil libur:', err));
  }, []);

  // ✅ Perbaikan: Gunakan holidays di dalam useMemo
  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const result = [];

    // Helper: cek apakah tanggal adalah libur
    const isHoliday = (date) => {
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return holidays.some((h) => h.date === dateString);
    };

    // Bulan lalu
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, prevMonthDays - i);
      result.push({ date: prevMonthDays - i, isCurrent: false, fullDate: d, holiday: isHoliday(d) });
    }

    // Bulan ini
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentYear, currentMonth, i);
      result.push({ date: i, isCurrent: true, fullDate: d, holiday: isHoliday(d) });
    }

    // Bulan depan
    const totalCells = Math.ceil(result.length / 7) * 7;
    for (let i = result.length; i < totalCells; i++) {
      const d = new Date(currentYear, currentMonth + 1, i - result.length + 1);
      result.push({ date: i - result.length + 1, isCurrent: false, fullDate: d, holiday: isHoliday(d) });
    }

    return result;
  }, [currentMonth, currentYear, holidays]); // ✅ Sekarang valid: holidays digunakan

  const handleChange = (dateArray) => {
    setSelectedDate(dateArray[0]);
  };

  return (
    <div className="calendar-container">
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
            weekdays: { shorthand: weekDays },
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

      <div className="calendar-wrapper">
        <table>
          <thead>
            <tr>
              {weekDays.map((day) => (
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
                  {weekDays.map((day, idx) => (
                    <td
                      key={idx}
                      className={`
                        ${day.isCurrent ? 'current-month' : 'other-month'}
                        ${day.holiday ? 'holiday' : ''}
                      `.trim()}
                    >
                      <div className="date-cell">
                        {day.date}
                        {day.holiday && <div className="holiday-dot"></div>}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
