// components/Kalender.jsx
import React, { useState, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

  // Acuan: Minggu 24 Maret 2024 = Minggu Legi
  const referenceDate = new Date('2024-03-24'); // Minggu Legi
  const referenceDayIndex = 0; // Minggu
  const referencePasarIndex = 0; // Legi

  // Fungsi: hitung hari pasaran dari tanggal
  const getWeton = (date) => {
    const diffInMs = date - referenceDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Hitung hari (7)
    const dayIndex = (referenceDayIndex + diffInDays) % 7;
    if (dayIndex < 0) dayIndex += 7;

    // Hitung pasaran (5)
    const pasarIndex = (referencePasarIndex + diffInDays) % 5;
    if (pasarIndex < 0) pasarIndex += 5;

    return {
      hari: dayNames[dayIndex],
      pasaran: pasaran[pasarIndex],
      // Hanya tampilkan pasaran (weton pasaran)
      weton: pasaran[pasarIndex],
    };
  };

  // Generate kalender - gunakan useMemo agar tidak rekomputasi tiap render
  const calendarDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Bulan sebelumnya
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(prevYear, prevMonth, daysInPrevMonth - i);
      days.push({
        date,
        isCurrentMonth: false,
        weton: getWeton(date).weton,
      });
    }

    // Bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        weton: getWeton(date).weton,
      });
    }

    // Bulan depan
    const totalDays = days.length;
    const remaining = 42 - totalDays; // 6 baris

    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        weton: getWeton(date).weton,
      });
    }

    return days;
  }, [selectedDate, referenceDate]); // ✅ Hanya rekomputasi saat selectedDate berubah

  const handleDateChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  const currentMonthName = monthNames[selectedDate.getMonth()];
  const currentYear = selectedDate.getFullYear();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Navigasi */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Kalender Jawa</h2>
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
              showMonths: 1,
              defaultDate: selectedDate,
              locale: {
                firstDayOfWeek: 1,
                weekdays: {
                  shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                  longhand: dayNames,
                },
                months: {
                  longhand: monthNames,
                  shorthand: monthNames.map(m => m.slice(0, 3)),
                },
              },
            }}
            className="w-full p-3 text-center border-2 border-blue-300 rounded-lg bg-blue-50 cursor-pointer font-medium"
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
                    const isToday =
                      day.date && new Date().toDateString() === day.date.toDateString();
                    const isCurrentMonth = day.isCurrentMonth;

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
                              ${isToday ? 'bg-yellow-400 text-black' : ''}
                            `}
                          >
                            {day.date.getDate()}
                          </span>
                          {/* Tampilkan hanya weton (pasaran) */}
                          <small
                            className={`text-xs mt-1 px-1 rounded
                              ${isCurrentMonth ? 'text-indigo-600 font-medium' : 'text-gray-400'}
                            `}
                          >
                            {day.weton}
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
        Weton ditampilkan berdasarkan siklus Jawa (acuan: 24 Maret 2024 = Minggu Legi)
      </div>
    </div>
  );
};

export default Kalender;
