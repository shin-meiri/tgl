// components/Kalender.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

// Fungsi: Hitung weton dari tanggal
const hitungWeton = (date) => {
  const hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const pasaranList = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

  const hariIndex = date.getDay(); // 0 (Minggu) - 6 (Sabtu)
  const hari = hariList[hariIndex];

  // Hitung siklus 5 pasaran: (timestamp / (24*3600*1000)) % 5
  const epoch = date.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const pasaranIndex = Math.floor(epoch / oneDay) % 5;
  const pasaran = pasaranList[Math.abs(pasaranIndex)];

  return `${hari} ${pasaran}`;
};

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Memo: generate nama bulan Indonesia
  const monthNames = useMemo(
    () => [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ],
    []
  );

  // Memo: generate hari-hari dalam kalender
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
    const remaining = 42 - totalDays; // 6 baris

    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  }, [selectedDate]); // ✅ Hanya recompute saat selectedDate berubah

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
              monthSelectorType: 'dropdown',
              yearSelectorType: 'dropdown',
              defaultDate: selectedDate,
              locale: {
                firstDayOfWeek: 1,
                months: { longhand: monthNames },
              },
            }}
            className="w-full p-3 text-center border-2 border-blue-300 rounded-lg bg-blue-50 font-medium cursor-pointer"
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

      {/* Kalender Tabel (tanpa nama hari, tapi tetap ada header kosong agar selaras) */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100">
              {Array.from({ length: 7 }, (_, i) => (
                <th key={i} className="border border-gray-300 p-2 bg-gray-200 text-gray-600 text-sm">
                  {/* Nama hari disembunyikan */}
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
                    if (!day) {
                      return <td key={idx} className="border border-gray-300 p-3 h-16"></td>;
                    }

                    const dateNum = day.date.getDate();
                    const isToday =
                      new Date().toDateString() === day.date.toDateString();
                    const isCurrentMonth = day.isCurrentMonth;
                    const weton = hitungWeton(day.date); // Format: "Senin Kliwon"

                    // Ambil hanya pasaran (Legi, Pahing, dll) dari string weton
                    const pasaran = weton.split(' ')[1] || '';

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
                              ${isToday ? 'bg-yellow-400 text-black' : ''}
                            `}
                          >
                            {dateNum}
                          </span>
                          <small className="text-xs mt-1 text-gray-600">
                            {pasaran}
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
        Gunakan dropdown untuk navigasi bulan. Weton ditampilkan di bawah tanggal.
      </div>
    </div>
  );
};

export default Kalender;
