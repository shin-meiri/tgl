// components/Kalender.jsx
import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';
import axios from 'axios';

const Kalender = () => {
  // Tanggal default: hari ini
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);

  // Ubah currentMonth saat Flatpickr ganti bulan
  const handleDateChange = (selectedDates) => {
    const date = selectedDates[0] || new Date();
    setCurrentMonth(new Date(date));
    setSelectedDate(date);
  };

  // Fungsi: Generate hari-hari dalam bulan
  useEffect(() => {
    generateCalendarDays(currentMonth);
  }, [currentMonth]);

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11

    const firstDay = new Date(year, month, 1).getDay(); // 0 (Minggu) - 6 (Sabtu)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = new Date(year, month - 1, 1);
    const nextMonth = new Date(year, month + 1, 1);

    const prevMonthDays = new Date(year, month, 0).getDate(); // Hari terakhir bulan lalu

    const days = [];

    // Tanggal dari akhir bulan sebelumnya
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: prevMonthDays - i,
        isCurrentMonth: false,
        fullDate: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonthDays - i),
      });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day),
      });
    }

    // Tanggal dari awal bulan depan
    const totalCells = 42; // 6 baris x 7 kolom
    const remaining = totalCells - days.length;
    for (let day = 1; day <= remaining; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day),
      });
    }

    setDaysInMonth(days);
  };

  // Format nama bulan & tahun untuk header
  const monthYearLabel = currentMonth.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      {/* Header: Flatpickr Navigasi */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Kalender Jawa</h2>

        <Flatpickr
          value={currentMonth}
          onChange={handleDateChange}
          options={{
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'F Y',
            allowInput: false,
            clickOpens: true,
            showMonths: 1,
            mode: 'single',
            inline: false,
            disableMobile: false,
            monthSelectorType: 'dropdown', // 🔽 Dropdown seperti Excel
            yearSelectorType: 'select',   // Dropdown tahun
            locale: {
              firstDayOfWeek: 1,
              weekdays: {
                shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                longhand: [
                  'Minggu',
                  'Senin',
                  'Selasa',
                  'Rabu',
                  'Kamis',
                  'Jumat',
                  'Sabtu',
                ],
              },
              months: {
                shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
                longhand: [
                  'Januari',
                  'Februari',
                  'Maret',
                  'April',
                  'Mei',
                  'Juni',
                  'Juli',
                  'Agustus',
                  'September',
                  'Oktober',
                  'November',
                  'Desember',
                ],
              },
            },
          }}
          className="text-lg font-semibold text-blue-700 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
          placeholder="Pilih bulan..."
        />
      </div>

      {/* Tabel Kalender Bulanan */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
              {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
                <th
                  key={day}
                  className="py-4 px-2 text-sm md:text-base font-semibold text-center"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, weekIndex) => {
              const start = weekIndex * 7;
              const row = daysInMonth.slice(start, start + 7);
              if (row.length === 0) return null;

              return (
                <tr key={weekIndex} className="border-t">
                  {row.map((dayObj, idx) => (
                    <td
                      key={idx}
                      className={`
                        h-16 md:h-20 border text-center relative
                        ${dayObj.isCurrentMonth ? 'text-gray-800' : 'text-gray-400 bg-gray-50'}
                        hover:bg-blue-50 transition
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-sm md:text-base font-medium">
                          {dayObj.date}
                        </span>
                        {/* Opsional: Tambahkan dot untuk tanggal penting */}
                        {/* Misal: hari Kliwon, Legi, dll dari API */}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Tanggal Terpilih */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          <strong>Tanggal dipilih:</strong>{' '}
          {selectedDate.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};

export default Kalender;
