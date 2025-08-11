// components/Kalender.jsx
import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Nama hari untuk header (tidak ditampilkan di dalam kotak)
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Nama bulan Indonesia
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Pasaran (5 hari siklus)
  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

  // Fungsi: cari pasaran berdasarkan jumlah hari sejak acuan (misal: 1 Jan 2000 = Legi)
  const getPasaran = (date) => {
    const epoch = new Date('2000-01-01'); // Acuan: 1 Jan 2000 = Legi (index 0)
    const diffTime = date.getTime() - epoch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const index = diffDays % 5;
    return pasaran[index < 0 ? index + 5 : index];
  };

  // Generate kalender setiap kali selectedDate berubah
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
      const date = new Date(prevYear, prevMonth, daysInPrevMonth - i);
      days.push({
        date,
        isCurrentMonth: false,
        pasaran: getPasaran(date),
      });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        pasaran: getPasaran(date),
      });
    }

    // Tanggal dari bulan depan (sampai 42 total)
    const totalSoFar = days.length;
    const remaining = 42 - totalSoFar;

    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        pasaran: getPasaran(date),
      });
    }

    setCalendarDays(days);
  }, [selectedDate]); // Cukup dependency: selectedDate

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
      {/* Navigasi dengan Flatpickr */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center sm:text-left">
          Kalender Weton Jawa
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
              mode: 'single',
              showMonths: 1,
              monthSelectorType: 'dropdown',
              yearSelectorType: 'dropdown',
              defaultDate: selectedDate,
              locale: {
                firstDayOfWeek: 1,
                weekdays: {
                  shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                  longhand: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
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
            {Array.from({ length: 6 }, (_, weekIndex) => {
              const start = weekIndex * 7;
              const end = start + 7;
              const week = calendarDays.slice(start, end);

              return (
                <tr key={weekIndex}>
                  {week.map((day, idx) => {
                    const dateNum = day?.date?.getDate();
                    const isToday =
                      day?.date &&
                      new Date().toDateString() === day.date.toDateString();
                    const isCurrentMonth = day?.isCurrentMonth;

                    return (
                      <td
                        key={idx}
                        className={`border border-gray-300 p-1 h-16 relative transition-colors
                          ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'hover:bg-blue-50'}
                        `}
                      >
                        <div className="flex flex-col h-full justify-center">
                          <span
                            className={`block w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium
                              ${isToday ? 'bg-yellow-400 text-black' : 'text-gray-700'}
                            `}
                          >
                            {dateNum}
                          </span>
                          {/* Tampilkan hanya pasaran (Legi, Pahing, dll) */}
                          <span
                            className={`block text-xs mt-1 px-1 py-0.5 rounded-sm
                              ${isCurrentMonth 
                                ? 'bg-green-100 text-green-800 font-semibold' 
                                : 'bg-gray-200 text-gray-500'}
                            `}
                          >
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
        Gunakan dropdown untuk ganti bulan. Weton pasaran dihitung otomatis.
      </div>
    </div>
  );
};

export default Kalender;
