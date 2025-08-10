// components/Kalender.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Nama pasaran (Pancawara)
  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const hariNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Fungsi: dapatkan weton dari tanggal (Hari + Pasaran)
  const getWeton = (date) => {
    const dayIndex = date.getDay(); // 0 (Minggu) - 6 (Sabtu)
    const hari = hariNames[dayIndex];

    // Hitung jumlah hari sejak 1 Suro 1836 (titik nol pasaran Legi)
    // Atau gunakan pendekatan: 1 Jan 1900 = Jumat Legi (acuan umum)
    const refDate = new Date(1900, 0, 22); // Selasa Pahing (banyak yang pakai 1 Jan 1900 = Senin Legi, tapi 22 Jan 1900 lebih akurat)
    const diffTime = date.getTime() - refDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const pasaranIndex = (diffDays + 1) % 5; // +1 karena 22 Jan 1900 = Selasa Pahing → Pahing = index 1
    const pasaranName = pasaran[pasaranIndex];

    return { hari, pasaran: pasaranName, weton: `${hari} ${pasaranName}` };
  };

  // Generate hari-hari dalam bulan
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
    const remaining = 42 - totalDays; // 6 baris

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Navigasi Flatpickr */}
      <div className="flex justify-center mb-6">
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
              months: {
                longhand: [
                  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ],
                shorthand: [
                  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
                ]
              }
            }
          }}
          className="w-64 p-3 text-center border-2 border-blue-300 rounded-lg bg-blue-50 font-medium cursor-pointer"
          placeholder="Pilih bulan/tahun"
        />
      </div>

      {/* Kalender Tabel (tanpa nama hari) */}
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
                          {/* Tampilkan hanya pasaran (weton) di bawah tanggal */}
                          <small className={`mt-1 text-xs ${isCurrentMonth ? 'text-purple-600 font-semibold' : 'text-gray-400'}`}>
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

      {/* Keterangan */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Navigasi: gunakan dropdown untuk ganti bulan. Weton ditampilkan di bawah setiap tanggal.
      </div>
    </div>
  );
};

export default Kalender;
