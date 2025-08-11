// components/Kalender.jsx
import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = ({ onDateClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Daftar pasaran (Pancawara)
  const pasaranList = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Fungsi: hitung pasaran dari tanggal
  const getWetonPasaran = (date) => {
    const epoch = new Date('1970-01-01'); // Selasa Wage
    const diffTime = date.getTime() - epoch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return pasaranList[diffDays % 5];
  };

  // Generate kalender tiap kali selectedDate berubah
  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0=Minggu
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
        isCurrent: false,
        pasaran: getWetonPasaran(d),
      });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      days.push({
        date: d,
        isCurrent: true,
        pasaran: getWetonPasaran(d),
      });
    }

    // Tanggal bulan depan (untuk 6 baris)
    const total = days.length;
    const remaining = 42 - total;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      days.push({
        date: d,
        isCurrent: false,
        pasaran: getWetonPasaran(d),
      });
    }

    setCalendarDays(days);
  }, [selectedDate]); // Hanya berjalan saat selectedDate berubah

  // Handle perubahan dari Flatpickr
  const handleDateChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  // Handle klik tanggal
  const handleDayClick = (day) => {
    if (!day.isCurrent) return;
    const formatted = day.date.toISOString().split('T')[0]; // YYYY-MM-DD
    if (onDateClick) {
      onDateClick(formatted, day.date, day.pasaran);
    }
  };

  const displayMonth = monthNames[selectedDate.getMonth()];
  const displayYear = selectedDate.getFullYear();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Navigasi dengan Flatpickr */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Kalender Weton Jawa</h2>
        <div className="w-full max-w-xs">
          <Flatpickr
            value={selectedDate}
            onChange={handleDateChange}
            options={{
              altFormat: 'F Y',
              dateFormat: 'Y-m-d',
              clickOpens: true,
              allowInput: false,
              mode: 'single',
              monthSelectorType: 'dropdown',
              yearSelectorType: 'dropdown',
              static: false,
              locale: {
                firstDayOfWeek: 1,
                months: { longhand: monthNames },
                weekdays: {
                  shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                  longhand: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
                },
              },
            }}
            className="w-full p-3 text-center border-2 border-blue-300 rounded-lg bg-blue-50 cursor-pointer font-medium"
            placeholder="Pilih bulan"
          />
        </div>
      </div>

      {/* Info Bulan */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">
          {displayMonth} {displayYear}
        </h3>
      </div>

      {/* Tabel Kalender */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {dayNames.map((day) => (
                <th
                  key={day}
                  className="border border-gray-300 p-3 bg-gradient-to-b from-blue-500 to-blue-600 text-white font-semibold"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, week) => {
              const start = week * 7;
              const end = start + 7;
              const weekDays = calendarDays.slice(start, end);

              return (
                <tr key={week}>
                  {weekDays.map((day, idx) => {
                    const isToday =
                      day && new Date().toDateString() === day.date.toDateString();
                    const isCurrent = day?.isCurrent ?? false;
                    const dateNum = day?.date?.getDate() ?? '';

                    return (
                      <td
                        key={idx}
                        onClick={() => handleDayClick(day)}
                        className={`
                          border border-gray-300 p-1 h-16 text-center relative
                          cursor-pointer
                          ${!isCurrent ? 'text-gray-400 bg-gray-50' : 'hover:bg-blue-50'}
                          ${isToday ? 'bg-yellow-200 font-bold' : ''}
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
                          {/* Tampilkan hanya pasaran di bawah tanggal */}
                          <small
                            className={`
                              block mt-1 text-xs font-semibold
                              ${isCurrent ? 'text-purple-700' : 'text-gray-400'}
                            `}
                          >
                            {day?.pasaran || ''}
                          </small>
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

      <p className="text-center mt-4 text-sm text-gray-500">
        Klik tanggal untuk cek detail weton
      </p>
    </div>
  );
};

export default Kalender;
