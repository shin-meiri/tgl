// components/Kalender.jsx
import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = () => {
  // State: tanggal yang dipilih di flatpickr (default hari ini)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // State: data kalender bulan ini (tanggal, hari, dll)
  const [calendarDays, setCalendarDays] = useState([]);

  // Nama hari (Indonesia)
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Nama bulan (Indonesia)
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Fungsi: generate hari-hari dalam bulan yang dipilih
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11

    const firstDay = new Date(year, month, 1).getDay(); // 0 (Minggu) - 6 (Sabtu)
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Jumlah hari

    const days = [];

    // Tambahkan tanggal dari bulan sebelumnya (jika ada)
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Tambahkan tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }

    // Tambahkan tanggal dari bulan depan jika belum 6 baris
    const totalDays = days.length;
    const remaining = 42 - totalDays; // 6 baris x 7 kolom

    for (let day = 1; day <= remaining; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    setCalendarDays(days);
  };

  // Update kalender saat tanggal berubah
  useEffect(() => {
    generateCalendarDays(selectedDate);
  }, [selectedDate]);

  // Handle perubahan dari Flatpickr
  const handleDateChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  // Ambil bulan & tahun dari selectedDate untuk ditampilkan
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const displayMonthName = monthNames[currentMonth];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Judul dan Flatpickr Navigasi */}
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
              altInput: true,
              altFormat: 'F Y',
              allowInput: false,
              clickOpens: true,
              showMonths: 1,
              mode: 'single',
              enableTime: false,
              time_24hr: true,
              static: false,
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

      {/* Info Bulan & Tahun */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">
          {displayMonthName} {currentYear}
        </h3>
      </div>

      {/* Kalender Tabel */}
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

              // Skip baris kosong jika tidak ada tanggal
              if (week.every((day) => !day)) return null;

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
                        className={`border border-gray-300 p-3 h-14 relative transition-colors
                          ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'hover:bg-blue-50'}
                          ${isToday ? 'bg-yellow-200 font-bold' : ''}
                        `}
                      >
                        <span
                          className={`block w-8 h-8 mx-auto rounded-full flex items-center justify-center
                            ${isToday ? 'bg-yellow-400 text-black' : ''}
                          `}
                        >
                          {dateNum}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Keterangan */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Gunakan dropdown di atas untuk navigasi bulan.
      </div>
    </div>
  );
};

export default Kalender;
