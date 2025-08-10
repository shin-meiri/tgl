// components/Kalender.jsx
import React, { useState, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Nama hari (Saptawara) - dipakai untuk hitung weton
  const saptawara = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  
  // Nama pasaran (Pancawara)
  const pancawara = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

  // Fungsi: dapatkan pasaran dari tanggal (1938 adalah tahun referensi Legi = 1 Jan)
  const getPasaran = (date) => {
    const start = new Date(1938, 0, 1); // 1 Jan 1938 = Legi
    const diffTime = date - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const index = diffDays % 5;
    return pancawara[index < 0 ? index + 5 : index];
  };

  // Fungsi: dapatkan weton (nama hari + pasaran)
  const getWeton = (date) => {
    const dayIndex = date.getDay(); // 0 (Minggu) - 6 (Sabtu)
    const hari = saptawara[dayIndex];
    const pasaran = getPasaran(date);
    return { hari, pasaran, label: pasaran }; // hanya tampilkan pasaran di UI
  };

  // Generate semua hari dalam bulan yang dipilih
  const calendarDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tanggal dari bulan sebelumnya
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(prevYear, prevMonth, daysInPrevMonth - i);
      days.push({ date, isCurrentMonth: false, ...getWeton(date) });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true, ...getWeton(date) });
    }

    // Tanggal dari bulan depan
    const totalDays = days.length;
    const remaining = 42 - totalDays; // 6 baris x 7 kolom

    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false, ...getWeton(date) });
    }

    return days;
  }, [selectedDate]); // ✅ Hanya recompute saat selectedDate berubah

  const handleDateChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const displayMonthName = monthNames[currentMonth];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Navigasi Flatpickr */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center sm:text-left">
          Kalender Weton
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
                  longhand: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
                },
                months: {
                  longhand: monthNames,
                  shorthand: monthNames.map(m => m.slice(0, 3)),
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
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
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
                    const isToday =
                      day.date &&
                      new Date().toDateString() === day.date.toDateString();
                    const isCurrentMonth = day.isCurrentMonth;

                    return (
                      <td
                        key={idx}
                        className={`border border-gray-300 p-2 h-16 relative text-xs transition-colors
                          ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'hover:bg-blue-50'}
                        `}
                      >
                        <div className="flex flex-col h-full justify-center items-center">
                          <span
                            className={`block w-8 h-8 flex items-center justify-center rounded-full text-sm
                              ${isToday ? 'bg-yellow-400 text-black font-bold' : ''}
                            `}
                          >
                            {day.date.getDate()}
                          </span>
                          {/* Hanya tampilkan pasaran (Legi, Pahing, Pon, Wage, Kliwon) */}
                          <span className="text-xs mt-1 text-gray-600 font-medium">
                            {day.label}
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
        Navigasi bulan: gunakan dropdown di atas.
      </div>
    </div>
  );
};

export default Kalender;
