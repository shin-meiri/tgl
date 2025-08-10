// components/Kalender.jsx
import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Daftar hari & pasaran Jawa
  const jawaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

  // Neptu untuk perhitungan jodoh nanti
  const neptuHari = { Minggu: 5, Senin: 4, Selasa: 3, Rabu: 7, Kamis: 8, Jumat: 6, Sabtu: 9 };
  const neptuPasaran = { Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8 };

  // Fungsi: cari pasaran dari tanggal (siklus 5)
  const getPasaran = (date) => {
    const epoch = new Date('1868-01-01'); // Tahun 1868 1 Suro = Selasa Kliwon (acuan kalender Jawa)
    const diff = Math.floor((date - epoch) / (1000 * 60 * 60 * 24));
    const index = diff % 5;
    return pasaran[index < 0 ? index + 5 : index];
  };

  // Fungsi: cari hari (Minggu-Sabtu)
  const getHari = (date) => {
    return jawaHari[date.getDay()];
  };

  // Fungsi: generate kalender
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Hari dari bulan sebelumnya
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      const prevDate = new Date(prevYear, prevMonth, daysInPrevMonth - i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        hari: getHari(prevDate),
        pasaran: getPasaran(prevDate),
      });
    }

    // Hari bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        hari: getHari(currentDate),
        pasaran: getPasaran(currentDate),
      });
    }

    // Hari dari bulan depan
    const totalDays = days.length;
    const remaining = 42 - totalDays; // 6 baris

    for (let day = 1; day <= remaining; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        hari: getHari(nextDate),
        pasaran: getPasaran(nextDate),
      });
    }

    setCalendarDays(days);
  };

  // Gunakan useEffect dengan dependensi yang benar
  useEffect(() => {
    generateCalendarDays(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]); // Cukup depend pada selectedDate

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
            clickOpens: true,
            allowInput: false,
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
              },
            },
          }}
          className="w-64 p-3 text-center border-2 border-blue-300 rounded-lg focus:outline-none bg-blue-50 font-medium cursor-pointer"
          placeholder="Pilih bulan/tahun"
        />
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
                      day?.date && new Date().toDateString() === day.date.toDateString();
                    const isCurrentMonth = day?.isCurrentMonth;
                    const weton = day ? `${day.hari} ${day.pasaran}` : '';

                    return (
                      <td
                        key={idx}
                        className={`border border-gray-300 p-2 h-16 relative text-sm
                          ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'hover:bg-blue-25'}
                        `}
                      >
                        <div
                          className={`inline-block w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-semibold
                            ${isToday ? 'bg-yellow-400 text-black' : 'text-gray-700'}
                          `}
                        >
                          {dateNum}
                        </div>
                        {/* Tampilkan Weton di bawah tanggal */}
                        {isCurrentMonth && (
                          <div className="text-xs text-gray-600 mt-1 font-medium">
                            {day.pasaran}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        Gunakan dropdown untuk navigasi bulan. Weton ditampilkan di bawah tanggal.
      </div>
    </div>
  );
};

export default Kalender;
