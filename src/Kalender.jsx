// components/Kalender.jsx
import React, { useState, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Ambil bulan & tahun dari selectedDate
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Generate kalender bulanan
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=Min, 6=Sab
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Hari dari bulan sebelumnya
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: prevMonthDays - i,
        isCurrentMonth: false,
        fullDate: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
      });
    }

    // Hari bulan ini
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(currentYear, currentMonth, i),
      });
    }

    // Total cells = multiple of 7
    const totalCells = Math.ceil(days.length / 7) * 7;

    // Hari dari bulan depan
    for (let i = days.length; i < totalCells; i++) {
      days.push({
        date: i - days.length + 1,
        isCurrentMonth: false,
        fullDate: new Date(currentYear, currentMonth + 1, i - days.length + 1),
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  // Ubah tanggal saat Flatpickr berubah
  const handleDateChange = (selectedDates) => {
    setSelectedDate(selectedDates[0]);
  };

  // Header hari
  const weekDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Judul */}
      <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Pilih Bulan</h3>

      {/* Flatpickr sebagai Navigasi */}
      <div className="mb-6">
        <Flatpickr
          value={selectedDate}
          onChange={handleDateChange}
          options={{
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'F Y', // Hanya Bulan dan Tahun
            allowInput: false,
            clickOpens: true,
            showMonths: 1,
            mode: 'single',
            enableTime: false,
            time_24hr: true,
            static: false,
            monthSelectorType: 'dropdown',
            yearSelectorType: 'dropdown',
            locale: {
              firstDayOfWeek: 1,
              weekdays: {
                shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                longhand: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
              },
              months: {
                shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                longhand: [
                  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
                ],
              },
            },
            // Sembunyikan inline calendar karena kita buat manual
            inline: false,
          }}
          className="w-full p-3 text-center text-lg border-2 border-blue-300 rounded-lg bg-blue-50 text-blue-800 font-medium cursor-pointer"
          placeholder="Pilih bulan..."
        />
      </div>

      {/* Tabel Kalender Manual */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-xs">
              {weekDays.map((day) => (
                <th key={day} className="py-2 px-1 text-center font-semibold border-r last:border-r-0 border-gray-300">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => {
              const start = weekIndex * 7;
              const week = calendarDays.slice(start, start + 7);
              return (
                <tr key={weekIndex} className="border-t border-gray-300">
                  {week.map((day, idx) => (
                    <td
                      key={idx}
                      className={`
                        py-3 px-1 text-center text-sm
                        ${day.isCurrentMonth ? 'text-gray-900 font-medium' : 'text-gray-400 italic'}
                        ${!day.isCurrentMonth ? 'bg-gray-100' : 'hover:bg-blue-100'}
                        border-r last:border-r-0 border-gray-300
                        transition
                      `}
                    >
                      {day.date}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Bulan & Tahun */}
      <p className="text-center mt-4 text-sm text-gray-500">
        Menampilkan: <strong>{new Date(currentYear, currentMonth).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</strong>
      </p>
    </div>
  );
};

export default Kalender;
