// components/Kalender.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Nama pasaran (Pancawara)
  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

  // Nama bulan Indonesia
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  // Fungsi: dapatkan pasaran dari tanggal
  const getPasaran = (date) => {
    const start = new Date(2023, 0, 1); // Acuan: 1 Jan 2023 = Minggu Legi
    const diffTime = date - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const index = diffDays % 5;
    return pasaran[index < 0 ? index + 5 : index];
  };

  // Memo: generate hari-hari dalam bulan yang dipilih
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
      days.push({ date, isCurrentMonth: false });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }

    // Tanggal dari bulan depan
    const totalDays = days.length;
    const remaining = 42 - totalDays; // 6 baris x 7 kolom

    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  }, [selectedDate]); // ✅ Hanya rekomputasi saat selectedDate berubah

  // Handle perubahan dari Flatpickr
  const handleDateChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]); // ✅ Pastikan hanya Date object
    }
  };

  // Memo: hitung weton untuk setiap hari
  const daysWithWeton = useMemo(() => {
    return calendarDays.map((day) => ({
      ...day,
      pasaran: getPasaran(day.date),
    }));
  }, [calendarDays]); // ✅ Tergantung pada calendarDays

  // Ambil bulan & tahun untuk tampilan
  const displayMonth = monthNames[selectedDate.getMonth()];
  const displayYear = selectedDate.getFullYear();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Navigasi dengan Flatpickr */}
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
                months: { longhand: monthNames },
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
          {displayMonth} {displayYear}
        </h3>
      </div>

      {/* Kalender Tabel (tanpa nama hari) */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg shadow">
        <table className="w-full border-collapse">
          <tbody>
            {Array.from({ length: 6 }, (_, weekIndex) => {
              const start = weekIndex * 7;
              const end = start + 7;
              const week = daysWithWeton.slice(start, end);

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
                        className={`border border-gray-300 p-3 h-16 relative transition-colors
                          ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'hover:bg-blue-50'}
                          ${isToday ? 'bg-yellow-200' : ''}
                        `}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span
                            className={`block w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                              ${isToday ? 'bg-yellow-400 text-black' : ''}
                            `}
                          >
                            {dateNum}
                          </span>
                          {/* Weton di bawah tanggal */}
                          <small
                            className={`block mt-1 text-xs font-normal
                              ${isCurrentMonth ? 'text-gray-600' : 'text-gray-400'}
                            `}
                          >
                            {day.pasaran}
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
        Gunakan dropdown untuk navigasi. Weton ditampilkan di bawah setiap tanggal.
      </div>
    </div>
  );
};

export default Kalender;
