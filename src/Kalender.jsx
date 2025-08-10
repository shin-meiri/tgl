// components/Kalender.jsx
import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Nama hari & pasaran
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const pasaranNames = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Fungsi: hitung pasaran dari tanggal (5 pasaran: siklus 5 hari)
  const getPasaran = (date) => {
    // Epoch: 1 Januari 1970 adalah Selasa Wage → jadi kita jadikan acuan
    const epoch = new Date('1970-01-01'); // Selasa Wage
    const diffTime = date.getTime() - epoch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const pasaranIndex = diffDays % 5;
    return pasaranNames[pasaranIndex < 0 ? pasaranIndex + 5 : pasaranIndex];
  };

  // Fungsi: dapatkan nama hari (dari JS)
  const getDayName = (date) => {
    return dayNames[date.getDay()];
  };

  // Fungsi: generate kalender + weton
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tanggal dari bulan lalu
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(prevYear, prevMonth, daysInPrevMonth - i);
      days.push({
        date: d,
        dayName: getDayName(d),
        pasaran: getPasaran(d),
        isCurrentMonth: false,
      });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      days.push({
        date: d,
        dayName: getDayName(d),
        pasaran: getPasaran(d),
        isCurrentMonth: true,
      });
    }

    // Tanggal bulan depan
    const totalDays = days.length;
    const remaining = 42 - totalDays; // 6 baris

    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      days.push({
        date: d,
        dayName: getDayName(d),
        pasaran: getPasaran(d),
        isCurrentMonth: false,
      });
    }

    setCalendarDays(days);
  };

  useEffect(() => {
    generateCalendarDays(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const displayMonthName = monthNames[currentMonth];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Navigasi Flatpickr */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Kalender Jawa + Weton</h2>
        <div className="w-full sm:w-64">
          <Flatpickr
            value={selectedDate}
            onChange={handleDateChange}
            options={{
              dateFormat: 'Y-m-d',
              altFormat: 'F Y',
              clickOpens: true,
              allowInput: false,
              monthSelectorType: 'dropdown',
              yearSelectorType: 'dropdown',
              defaultDate: selectedDate,
              locale: {
                firstDayOfWeek: 1,
                weekdays: { shorthand: ['Min','Sen','Sel','Rab','Kam','Jum','Sab'] },
                months: { longhand: monthNames }
              }
            }}
            className="w-full p-3 text-center border-2 border-blue-300 rounded-lg bg-blue-50 font-medium"
            placeholder="Pilih bulan/tahun"
          />
        </div>
      </div>

      {/* Info Bulan */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">
          {displayMonthName} {currentYear}
        </h3>
      </div>

      {/* Tabel Kalender dengan Weton */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100">
              {dayNames.map((day) => (
                <th key={day} className="border border-gray-300 p-3 bg-blue-600 text-white font-semibold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, weekIndex) => {
              const start = weekIndex * 7;
              const end = start + 7;
              const week = calendarDays.slice(start, end);

              return (
                <tr key={weekIndex}>
                  {week.map((day, idx) => {
                    const isToday =
                      day?.date && new Date().toDateString() === day.date.toDateString();
                    const isCurrentMonth = day?.isCurrentMonth;
                    const dateNum = day?.date?.getDate();

                    return (
                      <td
                        key={idx}
                        className={`border border-gray-300 p-2 h-16 relative
                          ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'hover:bg-blue-50'}
                          ${isToday ? 'bg-yellow-200' : ''}
                        `}
                      >
                        <div className="flex flex-col h-full justify-center">
                          <span
                            className={`block w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm
                              ${isToday ? 'bg-yellow-400 text-black font-bold' : ''}
                            `}
                          >
                            {dateNum}
                          </span>
                          <span className="text-xs font-medium mt-1 text-gray-700">
                            {day?.pasaran || ''}
                          </span>
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

      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Weton (pasaran) dihitung otomatis berdasarkan kalender Jawa.</p>
      </div>
    </div>
  );
};

export default Kalender;
