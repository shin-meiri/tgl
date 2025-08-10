// components/Kalender.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

// Hari & Pasaran Jawa
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

// Mapping: indeks pasaran → nama
const getPasaran = (tanggal) => {
  // Algoritma: 1 Januari 1900 = Senin Legi (acuan kalender Jawa)
  const epoch = new Date('1900-01-01'); // Senin Legi
  const diff = Math.floor((tanggal - epoch) / (1000 * 60 * 60 * 24));
  const pasaranIndex = diff % 5;
  return PASARAN[pasaranIndex];
};

// Fungsi: dapatkan nama weton dari tanggal
const getWeton = (date) => {
  const hariIndex = date.getDay(); // 0 (Minggu) - 6 (Sabtu)
  const hari = HARI[hariIndex];
  const pasaran = getPasaran(date);
  return `${hari} ${pasaran}`; // Misal: "Senin Kliwon"
};

// Fungsi: dapatkan hanya nama pasaran (weton singkat)
const getNamaPasaran = (date) => {
  return getPasaran(date);
};

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Nama bulan Indonesia
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  // Memo: generate hari-hari hanya saat selectedDate berubah
  const generateCalendarDays = useMemo(() => {
    return () => {
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
          pasaran: getNamaPasaran(date),
        });
      }

      // Tanggal bulan ini
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        days.push({
          date,
          isCurrentMonth: true,
          pasaran: getNamaPasaran(date),
        });
      }

      // Tanggal dari bulan depan
      const totalDays = days.length;
      const remaining = 42 - totalDays; // 6 baris × 7

      for (let day = 1; day <= remaining; day++) {
        const date = new Date(year, month + 1, day);
        days.push({
          date,
          isCurrentMonth: false,
          pasaran: getNamaPasaran(date),
        });
      }

      return days;
    };
  }, [selectedDate]); // Hanya re-generate saat selectedDate berubah

  // Update calendarDays saat selectedDate berubah
  useEffect(() => {
    setCalendarDays(generateCalendarDays());
  }, [generateCalendarDays]); // generateCalendarDays sudah di-memo

  // Handle perubahan dari Flatpickr
  const handleDateChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(new Date(dates[0])); // Pastikan objek Date
    }
  };

  const currentMonthName = monthNames[selectedDate.getMonth()];
  const currentYear = selectedDate.getFullYear();

  // Cek apakah tanggal adalah hari ini
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
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
            mode: 'single',
            showMonths: 1,
            monthSelectorType: 'dropdown',
            yearSelectorType: 'dropdown',
            defaultDate: selectedDate,
            locale: {
              firstDayOfWeek: 1,
              weekdays: {
                shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                longhand: HARI,
              },
              months: {
                shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                longhand: monthNames,
              },
            },
          }}
          className="w-64 p-3 text-center border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-blue-50 font-medium"
          placeholder="Pilih bulan/tahun"
        />
      </div>

      {/* Info Bulan & Tahun */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">
          {currentMonthName} {currentYear}
        </h3>
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
                <tr key={`week-${weekIndex}`}>
                  {week.map((day, idx) => {
                    if (!day) return <td key={idx} className="border border-gray-300 p-3 h-20"></td>;

                    const { date, isCurrentMonth, pasaran } = day;
                    const dateNum = date.getDate();
                    const today = isToday(date);

                    return (
                      <td
                        key={date.toISOString()} // Unique key
                        className={`border border-gray-300 p-2 h-20 relative transition-colors
                          ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'hover:bg-blue-50'}
                          ${today ? 'bg-yellow-200' : ''}
                        `}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span
                            className={`block w-8 h-8 mb-1 flex items-center justify-center rounded-full text-sm font-medium
                              ${today ? 'bg-yellow-400 text-black' : 'text-gray-800'}
                            `}
                          >
                            {dateNum}
                          </span>
                          <span
                            className={`text-xs px-1 py-0.5 rounded-sm text-white bg-green-600 shadow-sm
                              ${!isCurrentMonth ? 'opacity-60' : ''}
                            `}
                          >
                            {pasaran}
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
        Gunakan dropdown untuk navigasi bulan. Weton ditampilkan di bawah setiap tanggal.
      </div>
    </div>
  );
};

export default Kalender;
