// components/Kalender.jsx
import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Daftar pasaran (Pancawara)
  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Fungsi: dapatkan pasaran dari tanggal (algoritma kalender Jawa sederhana)
  const getWetonPasaran = (date) => {
    // Epoch: 1 Januari 1970 adalah Selasa Wage
    const epoch = new Date('1970-01-01'); // Selasa Wage
    const diffTime = date - epoch;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const pasaranIndex = diffDays % 5;
    return pasaran[pasaranIndex];
  };

  // Fungsi: generate kalender
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tanggal dari bulan sebelumnya
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

    // Tanggal dari bulan depan
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
  };

  // Gunakan useEffect tanpa useMemo — langsung generate
  useEffect(() => {
    generateCalendarDays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]); // Hanya berjalan saat selectedDate berubah

  const handleDateChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  const currentMonthName = monthNames[selectedDate.getMonth()];
  const currentYear = selectedDate.getFullYear();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Navigasi Flatpickr */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Kalender Weton</h2>
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
              monthSelectorType: 'dropdown',
              yearSelectorType: 'dropdown',
              defaultDate: selectedDate,
              locale: {
                firstDayOfWeek: 1,
                weekdays: {
                  shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                  longhand: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
                },
                months: { longhand: monthNames },
              },
            }}
            className="w-full p-3 text-center border-2 border-blue-300 rounded-lg bg-blue-50 cursor-pointer"
            placeholder="Pilih bulan/tahun"
          />
        </div>
      </div>

      {/* Info Bulan */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">
          {currentMonthName} {currentYear}
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
                        className={`border border-gray-300 p-2 h-16 relative transition-colors
                          ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'hover:bg-blue-50'}
                          ${isToday ? 'bg-yellow-200' : ''}
                        `}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span
                            className={`block w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                              ${isToday ? 'bg-yellow-400 text-black' : 'text-gray-700'}
                            `}
                          >
                            {dateNum}
                          </span>
                          {/* Tampilkan hanya pasaran di bawah tanggal */}
                          <small
                            className={`block mt-1 text-xs font-semibold
                              ${isCurrentMonth ? 'text-purple-600' : 'text-gray-400'}
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

      <div className="mt-4 text-sm text-gray-500 text-center">
        Weton pasaran dihitung dari siklus 5 hari: Legi, Pahing, Pon, Wage, Kliwon.
      </div>
    </div>
  );
};

export default Kalender;
