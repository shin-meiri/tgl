// components/Kalender.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

// Mapping hari ke neptu (untuk debug/weton)
const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const pasaranNames = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

// Fungsi: hitung pasaran dari tanggal
const getPasaran = (date) => {
  const startDate = new Date('2023-01-01'); // Tanggal acuan: Minggu Legi
  const diffTime = date - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const pasaranIndex = (diffDays % 5 + 5) % 5; // Modulo aman untuk negatif
  return pasaranNames[pasaranIndex];
};

// Fungsi: dapatkan nama hari
const getDayName = (date) => {
  return dayNames[date.getDay()];
};

// Fungsi: dapatkan nama weton (hari + pasaran)
const getWeton = (date) => {
  const day = getDayName(date);
  const pasaran = getPasaran(date);
  return `${day} ${pasaran}`;
};

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Memo: generate hari-hari dalam bulan (tanpa recompute berlebihan)
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
      days.push({
        date,
        isCurrentMonth: false,
        weton: getWeton(date),
      });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        weton: getWeton(date),
      });
    }

    // Tanggal dari bulan depan
    const totalDays = days.length;
    const remaining = 42 - totalDays;

    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        weton: getWeton(date),
      });
    }

    return days;
  }, [selectedDate]); // Hanya recompute saat selectedDate berubah

  // Handle perubahan dari Flatpickr
  const handleDateChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  // Nama bulan Indonesia
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const displayMonth = monthNames[selectedDate.getMonth()];
  const displayYear = selectedDate.getFullYear();

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
              clickOpens: true,
              allowInput: false,
              showMonths: 1,
              mode: 'single',
              enableTime: false,
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
          {displayMonth} {displayYear}
        </h3>
      </div>

      {/* Tabel Kalender */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-center">
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
                    const wetonLabel = day?.weton?.split(' ')[1]; // Ambil pasaran: "Kliwon"

                    return (
                      <td
                        key={idx}
                        className={`border border-gray-300 p-2 h-20 relative transition-colors
                          ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'hover:bg-blue-25'}
                        `}
                      >
                        <div className="flex flex-col h-full justify-center items-center">
                          <span
                            className={`block w-8 h-8 rounded-full flex items-center justify-center text-sm
                              ${isToday ? 'bg-yellow-400 text-black font-bold' : ''}
                            `}
                          >
                            {dateNum}
                          </span>
                          {wetonLabel && (
                            <small className="text-xs mt-1 font-medium text-gray-600">
                              {wetonLabel}
                            </small>
                          )}
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
        Navigasi bulan dengan dropdown di atas.
      </div>
    </div>
  );
};

export default Kalender;
