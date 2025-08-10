// components/Kalender.jsx
import React, { useState, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// === Fungsi Hitung Weton & Pasaran ===
const hitungWeton = (date) => {
  const hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const pasaranList = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

  const dayIndex = date.getDay();
  const hari = hariList[dayIndex];

  // Acuan: 1 Jan 1900 = Selasa Pahing (dalam kalender Jawa)
  const selisihHari = Math.floor((date - new Date(1900, 0, 1)) / (1000 * 60 * 60 * 24));
  const pasaranIndex = selisihHari % 5;
  const pasaran = pasaranList[pasaranIndex];

  return { hari, pasaran };
};

// === Komponen Utama ===
const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // === Generate Kalender Bulanan ===
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=Min
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // 📆 1. Tanggal dari bulan sebelumnya
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, prevMonthDays - i);
      const { pasaran } = hitungWeton(d);
      days.push({
        date: prevMonthDays - i,
        isCurrentMonth: false,
        pasaran,
      });
    }

    // 📆 2. Tanggal bulan ini
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentYear, currentMonth, i);
      const { pasaran } = hitungWeton(d);
      days.push({
        date: i,
        isCurrentMonth: true,
        pasaran,
        fullDate: d,
      });
    }

    // 📆 3. Tanggal dari bulan depan (perbaikan: jangan semua 1!)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    const nextMonthYear = nextMonth.getFullYear();
    const nextMonthIndex = nextMonth.getMonth();

    for (let i = days.length; i < totalCells; i++) {
      const dateNum = i - days.length + 1;
      const d = new Date(nextMonthYear, nextMonthIndex, dateNum);
      const { pasaran } = hitungWeton(d);
      days.push({
        date: dateNum,
        isCurrentMonth: false,
        pasaran,
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  // Header hari (hanya singkatan)
  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const handleDateChange = (dates) => {
    setSelectedDate(dates[0]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Judul */}
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Kalender Jawa
      </h3>

      {/* Navigasi dengan Flatpickr */}
      <div className="mb-6 text-center">
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
            locale: {
              months: {
                longhand: [
                  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ],
                shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des']
              },
              weekdays: {
                shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                longhand: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
              }
            },
            inline: false
          }}
          className="p-3 border-2 border-blue-400 rounded-lg text-lg font-medium bg-blue-50 text-blue-800 w-64"
          placeholder="Pilih bulan..."
        />
      </div>

      {/* Tabel Kalender Jawa */}
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white uppercase text-sm">
            {weekDays.map(day => (
              <th key={day} className="py-3 border border-gray-400">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => {
            const start = weekIndex * 7;
            const week = calendarDays.slice(start, start + 7);
            return (
              <tr key={weekIndex}>
                {week.map((day, idx) => (
                  <td
                    key={idx}
                    className={`
                      border border-gray-300 h-20 align-top p-2 text-center
                      ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-100 text-gray-400'}
                      hover:bg-yellow-50 transition
                    `}
                  >
                    {/* Tanggal */}
                    <div className="font-bold text-gray-800 text-sm">
                      {day.date}
                    </div>
                    {/* Pasaran */}
                    <div className="text-xs text-green-700 font-medium mt-1">
                      {day.pasaran}
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Info Bulan */}
      <p className="text-center mt-4 text-sm text-gray-500">
        Menampilkan: <strong>{selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</strong>
      </p>
    </div>
  );
};

export default Kalender;
