// components/Kalender.jsx
import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = ({ onDateClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  const pasaranList = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  // Hitung pasaran: 1 Jan 1970 = Selasa Wage → index 3
  const getWetonPasaran = (date) => {
    const epochMs = new Date('1970-01-01T00:00:00').getTime();
    const dateMs = date.getTime();
    const diffDays = Math.floor((dateMs - epochMs) / (1000 * 60 * 60 * 24));
    return pasaranList[diffDays % 5];
  };

  // Generate ulang kalender saat selectedDate berubah
  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tanggal dari bulan lalu
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevDate = new Date(prevYear, prevMonth, daysInPrevMonth - i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        pasaran: getWetonPasaran(prevDate),
      });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        pasaran: getWetonPasaran(currentDate),
      });
    }

    // Tanggal bulan depan
    const totalDays = days.length;
    const remaining = 42 - totalDays; // 6 baris
    for (let day = 1; day <= remaining; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        pasaran: getWetonPasaran(nextDate),
      });
    }

    setCalendarDays(days);
  }, [selectedDate]); // Hanya bergantung pada selectedDate

  const handleChangeDate = (dates) => {
    if (Array.isArray(dates) && dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  const handleClickDay = (day) => {
    if (onDateClick && day.isCurrentMonth) {
      const isoDate = day.date.toISOString().split('T')[0];
      onDateClick(isoDate, day.date, day.pasaran);
    }
  };

  const currentMonth = monthNames[selectedDate.getMonth()];
  const currentYear = selectedDate.getFullYear();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Kalender Weton</h2>
        <div className="w-full max-w-xs mt-3">
          <Flatpickr
            options={{
              altFormat: 'F Y',
              dateFormat: 'Y-m-d',
              clickOpens: true,
              allowInput: false,
              monthSelectorType: 'dropdown',
              yearSelectorType: 'dropdown',
              locale: {
                firstDayOfWeek: 1,
                weekdays: { shorthand: dayNames },
                months: { longhand: monthNames },
              },
            }}
            value={selectedDate}
            onChange={handleChangeDate}
            className="w-full p-3 text-center border-2 border-blue-300 rounded-lg bg-blue-50 cursor-pointer"
            placeholder="Pilih bulan"
          />
        </div>
      </div>

      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">
          {currentMonth} {currentYear}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {dayNames.map((day) => (
                <th
                  key={day}
                  className="border border-gray-300 p-3 bg-blue-600 text-white font-semibold"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, weekIndex) => (
              <tr key={weekIndex}>
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const idx = weekIndex * 7 + dayIndex;
                  const day = calendarDays[idx];

                  if (!day) {
                    return <td key={dayIndex} className="border border-gray-300 p-3"></td>;
                  }

                  const isToday =
                    new Date().toDateString() === day.date.toDateString();
                  const isCurrent = day.isCurrentMonth;
                  const dateNum = day.date.getDate();

                  return (
                    <td
                      key={dayIndex}
                      onClick={() => handleClickDay(day)}
                      className={`
                        border border-gray-300 p-1 h-16 cursor-pointer
                        ${isCurrent ? 'hover:bg-blue-50' : 'text-gray-400 bg-gray-50'}
                        ${isToday ? 'bg-yellow-200' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span
                          className={`
                            block w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                            ${isToday ? 'bg-yellow-400 text-black' : 'text-gray-700'}
                          `}
                        >
                          {dateNum}
                        </span>
                        <small
                          className={`
                            block mt-1 text-xs font-semibold
                            ${isCurrent ? 'text-purple-700' : 'text-gray-400'}
                          `}
                        >
                          {day.pasaran}
                        </small>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center mt-4 text-sm text-gray-500">
        Klik tanggal untuk lihat detail weton
      </p>
    </div>
  );
};

export default Kalender;
