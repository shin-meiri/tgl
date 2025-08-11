// components/Kalender.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

// Map nama hari ke inisial
const dayInitials = {
  Minggu: 'Mg',
  Senin: 'Sn',
  Selasa: 'Sl',
  Rabu: 'Rb',
  Kamis: 'Km',
  Jumat: 'Jm',
  Sabtu: 'St',
};

// Map pasaran ke inisial
const pasaranInitials = {
  Legi: 'L',
  Pahing: 'G', // "G" karena P sudah dipakai Pon
  Pon: 'P',
  Wage: 'W',
  Kliwon: 'K',
};

// Fungsi: hitung weton dari tanggal (hanya untuk tampilan)
const getWetonShort = (date) => {
  const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()];

  // Hitung pasaran: siklus 5 hari (Legi=0, Pahing=1, Pon=2, Wage=3, Kliwon=4)
  const baseDate = new Date(2023, 0, 1); // Misal: 1 Jan 2023 = Minggu Legi
  const diffTime = Math.abs(date - baseDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const pasaranIndex = diffDays % 5;
  const pasaranNames = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const pasaranName = pasaranNames[pasaranIndex];

  const dayShort = dayInitials[dayName];
  const pasaranShort = pasaranInitials[pasaranName];

  return `${dayShort}+${pasaranShort}`; // Contoh: Sn+K
};

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Memoisasi: generate hari-hari hanya saat selectedDate berubah
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
  }, [selectedDate]); // ✅ Hanya recompute saat selectedDate berubah

  // Handle perubahan dari Flatpickr
  const handleDateChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]); // ✅ Aman, tidak langsung manipulasi state di useEffect
    }
  };

  // Nama bulan Indonesia
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const displayMonthName = monthNames[selectedDate.getMonth()];
  const displayYear = selectedDate.getFullYear();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Navigasi Flatpickr */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Kalender Jawa</h2>
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
                  shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                },
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
          {displayMonthName} {displayYear}
        </h3>
      </div>

      {/* Tabel Kalender */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100">
              {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
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

                    const { date, isCurrentMonth } = day;
                    const dateNum = date.getDate();
                    const isToday = new Date().toDateString() === date.toDateString();
                    const wetonLabel = getWetonShort(date); // Misal: Sn+K

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
                          <span className="text-xs text-gray-500 mt-1 font-mono">
                            {wetonLabel}
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
        Navigasi dengan dropdown di atas • Weton: <code className="bg-gray-100 px-1 rounded">Sn+K</code> = Senin Kliwon
      </div>
    </div>
  );
};

export default Kalender;
