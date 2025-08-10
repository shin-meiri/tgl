// components/Kalender.jsx
import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';
import axios from 'axios';

const Kalender = () => {
  // State: bulan & tahun yang sedang ditampilkan
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Format: YYYY-MM (untuk kirim ke backend)
  const formattedMonth = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, '0')}`;

  // Fungsi: generate kalender grid
  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11

    const firstDay = new Date(year, month, 1).getDay(); // 0 (Minggu) - 6 (Sabtu)
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Jumlah hari
    const prevMonthDays = new Date(year, month, 0).getDate(); // Hari terakhir bulan lalu

    const calendar = [];

    // Tanggal dari bulan sebelumnya
    for (let i = firstDay - 1; i >= 0; i--) {
      calendar.push({
        date: prevMonthDays - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthDays - i),
      });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      calendar.push({
        date: day,
        isCurrentMonth: true,
        fullDate,
      });
    }

    // Tambahkan tanggal dari bulan depan jika belum penuh (6 baris)
    const totalCells = calendar.length;
    const remainingCells = 42 - totalCells; // 6 baris × 7 = 42
    for (let day = 1; day <= remainingCells; day++) {
      calendar.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, day),
      });
    }

    setDaysInMonth(calendar);
  };

  // Update kalender saat currentMonth berubah
  useEffect(() => {
    generateCalendar(currentMonth);
  }, [currentMonth]);

  // Handle pilihan dari flatpickr
  const handleMonthChange = (selectedDates) => {
    setCurrentMonth(selectedDates[0]);
  };

  // Handle klik tanggal
  const handleDateClick = (day) => {
    setSelectedDate(day.fullDate);
    console.log('Tanggal dipilih:', day.fullDate.toISOString().split('T')[0]);

    // 🔜 Nanti kirim ke backend via axios
    // fetchWeton(day.fullDate);
  };

  // Nama bulan dalam bahasa Indonesia
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const hariLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      {/* Judul dan Navigasi Flatpickr */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Kalender Jawa
        </h2>

        <Flatpickr
          value={currentMonth}
          onChange={handleMonthChange}
          options={{
            dateFormat: 'Y-m',
            altInput: true,
            altFormat: 'F Y',
            allowInput: false,
            clickOpens: true,
            mode: 'single',
            enableTime: false,
            time_24hr: true,
            static: false,
            monthSelectorType: 'dropdown', // 🔽 Dropdown bulan seperti Excel
            showMonths: 1,
            locale: {
              firstDayOfWeek: 1,
              months: {
                shorthand: [
                  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
                ],
                longhand: monthNames,
              },
              weekdays: {
                shorthand: hariLabels,
                longhand: [
                  'Minggu', 'Senin', 'Selasa', 'Rabu',
                  'Kamis', 'Jumat', 'Sabtu'
                ],
              },
            },
          }}
          className="px-4 py-2 border-2 border-blue-500 rounded-lg text-lg font-medium text-center w-48 cursor-pointer focus:outline-none"
          placeholder="Pilih bulan..."
        />
      </div>

      {/* Info Bulan & Tahun */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-700">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
      </div>

      {/* Kalender Grid */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Header Hari */}
        <div className="grid grid-cols-7 bg-gray-100 text-center font-semibold text-gray-700 py-3 border-b">
          {hariLabels.map((hari) => (
            <div key={hari} className="uppercase text-sm">
              {hari}
            </div>
          ))}
        </div>

        {/* Tanggal Kalender */}
        <div className="grid grid-cols-7 text-center">
          {daysInMonth.map((day, index) => {
            const isToday =
              new Date().toDateString() === day.fullDate.toDateString();
            const isSelected =
              selectedDate &&
              selectedDate.toDateString() === day.fullDate.toDateString();

            return (
              <div
                key={index}
                className={`
                  min-h-16 py-2 border-r border-b border-gray-200 
                  cursor-pointer transition-all duration-150
                  ${!day.isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'hover:bg-blue-50'}
                  ${isToday ? 'bg-red-100 border-2 border-red-300 font-bold text-red-700' : ''}
                  ${isSelected ? 'bg-blue-200 border-2 border-blue-400' : ''}
                `}
                onClick={() => handleDateClick(day)}
              >
                <span className="text-sm font-medium">{day.date}</span>
                {/* Nanti bisa tambah simbol weton di sini */}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Tanggal Terpilih */}
      {selectedDate && (
        <div className="mt-6 text-center">
          <p className="text-lg">
            <strong>Dipilih:</strong>{' '}
            {selectedDate.toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default Kalender;
