// components/Kalender.jsx
import React, { useState, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: prevMonthDays - i, isCurrent: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, isCurrent: true });
    }
    const total = Math.ceil(days.length / 7) * 7;
    for (let i = days.length; i < total; i++) {
      days.push({ date: i - days.length + 1, isCurrent: false });
    }

    return days;
  }, [currentMonth, currentYear]);

  const weekDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return (
    <div className="mx-auto p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-center text-primary mb-4">Kalender Jawa</h3>

      <div className="mb-6">
        <Flatpickr
          value={selectedDate}
          onChange={([date]) => setSelectedDate(date)}
          options={{
            altFormat: 'F Y',
            dateFormat: 'Y-m-d',
            clickOpens: true,
            monthSelectorType: 'dropdown',
            yearSelectorType: 'dropdown',
            locale: {
              firstDayOfWeek: 1,
              weekdays: { shorthand: ['Min','Sen','Sel','Rab','Kam','Jum','Sab'] },
              months: { longhand: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'] }
            }
          }}
          className="w-full p-3 text-center text-lg border-2 border-primary rounded-lg bg-blue-50 text-primary font-medium"
          placeholder="Pilih bulan..."
        />
      </div>

      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="bg-primary text-white">
            {weekDays.map(day => (
              <th key={day} className="py-2 px-1 font-semibold border">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, week) => {
            const start = week * 7;
            return (
              <tr key={week} className="border-t">
                {calendarDays.slice(start, start + 7).map((day, i) => (
                  <td
                    key={i}
                    className={`calendar-day py-3 px-1 text-center text-sm border ${
                      day.isCurrent ? 'current' : 'text-gray-400'
                    }`}
                  >
                    {day.date}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Kalender;
