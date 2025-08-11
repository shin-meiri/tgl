// components/Kalender.jsx
import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [wetonMap, setWetonMap] = useState({}); // Cache weton per tanggal

  // Daftar pasaran (Pancawara) berulang tiap 5 hari
  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  // Fungsi: hitung pasaran dari jumlah hari sejak acuan (misal: 1 Jan 2000 = Legi)
  const getPasaran = (date) => {
    const refDate = new Date('2000-01-01'); // Asumsi 1 Jan 2000 = Legi (index 0)
    const diffTime = date.getTime() - refDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const index = Math.abs(diffDays) % 5; // 5 pasaran
    return pasaran[index];
  };

  // Fungsi: generate semua hari dalam kalender
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tanggal dari bulan lalu
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(prevYear, prevMonth, daysInPrevMonth - i);
      days.push({ date: d, isCurrentMonth: false });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      days.push({ date: d, isCurrentMonth: true });
    }

    // Tanggal bulan depan (sampai 42 sel)
    const totalDays = days.length;
    const remaining = 42 - totalDays;

    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      days.push({ date: d, isCurrentMonth: false });
    }

    setCalendarDays(days);
  };

  // Efek: generate kalender saat selectedDate berubah
  useEffect(() => {
    generateCalendarDays(selectedDate);
  }, [selectedDate]); // ✅ Hanya bergantung pada selectedDate

  // Efek: hitung weton untuk semua tanggal di bulan ini
  useEffect(() => {
    const map = {};
    calendarDays.forEach((day) => {
      if (day.date) {
        const key = day.date.toISOString().split('T')[0]; // YYYY-MM-DD
        map[key] = getPasaran(day.date);
      }
    });
    setWetonMap(map);
  }, [calendarDays]); // ✅ Hanya dijalankan saat calendarDays berubah

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
        <h2 className="text-2xl font-bold text-gray-800 text-center sm:text-left">
          Kalender Jawa
        </h2>

        <div className="w-full sm:w-64">
          <Flatpickr
            value={selectedDate}
            onChange={handleDateChange}
            options={{
              dateFormat: 'Y-m-d',
              altFormat: 'F Y',
              allowInput: false,
              clickOpens: true,
              monthSelectorType: 'dropdown',
              yearSelectorType: 'dropdown',
              defaultDate: selectedDate,
              locale: {
                firstDayOfWeek: 1,
                weekdays: {
                  shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                  longhand: dayNames,
                },
                months: {
                  shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                  longhand: monthNames,
                },
              },
            }}
            className="w-full p-3 text-center border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-blue-50 font-medium"
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

      {/* Tabel Kalender */}
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
                    if (!day) return <td key={idx} className="border border-gray-300 p-3"></td>;

                    const dateNum = day.date.getDate();
                    const dateKey = day.date.toISOString().split('T')[0];
                    const isToday =
                      new Date().toDateString() === day.date.toDateString();
                    const isCurrentMonth = day.isCurrentMonth;
                    const pasaranWeton = wetonMap[dateKey] || '';

                    return (
                      <td
                        key={idx}
                        className={`border border-gray-300 p-2 h-16 relative transition-colors
                          ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'hover:bg-blue-50'}
                          ${isToday ? 'bg-yellow-200' : ''}
                        `}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span
                            className={`block w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                              ${isToday ? 'bg-yellow-400 text-black' : 'text-gray-700'}
                            `}
                          >
                            {dateNum}
                          </span>
                          {/* Hanya tampilkan pasaran (weton) di bawah tanggal */}
                          <small
                            className={`block mt-1 text-xs font-semibold
                              ${isCurrentMonth ? 'text-purple-600' : 'text-gray-400'}
                            `}
                          >
                            {pasaranWeton}
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

      <div className="mt-4 text-sm text-gray-500 text-center">
        Gunakan dropdown untuk navigasi. Weton (pasaran) ditampilkan di bawah setiap tanggal.
      </div>
    </div>
  );
};

export default Kalender;
