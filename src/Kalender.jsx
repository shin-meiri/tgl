// components/KalenderNavigasi.jsx
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const KalenderNavigasi = () => {
  // Default: bulan ini
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Nama hari (Indonesia)
  const hariNama = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Nama bulan (Indonesia)
  const bulanNama = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Ambil bulan dan tahun dari selectedDate
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Dapatkan tanggal pertama dan terakhir bulan
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 (Minggu) - 6 (Sabtu)
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Siapkan grid kalender
  const calendar = [];
  let date = 1;

  // Baris 1: dari minggu pertama
  for (let i = 0; i < 6; i++) {
    const week = [];

    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        // Tanggal dari bulan sebelumnya
        const prevMonthLast = new Date(currentYear, currentMonth, 0).getDate();
        week.push({ day: prevMonthLast - firstDay + j + 1, type: 'prev' });
      } else if (date > lastDate) {
        // Tanggal dari bulan berikutnya
        week.push({ day: date - lastDate, type: 'next' });
        date++;
      } else {
        week.push({ day: date, type: 'current' });
        date++;
      }
    }

    calendar.push(week);

    // Hentikan jika sudah lewati semua tanggal
    if (date > lastDate && i >= 1) break;
  }

  // Handler saat user ganti bulan via Flatpickr
  const handleMonthChange = (selectedDates) => {
    setSelectedDate(new Date(selectedDates[0]));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
      {/* Navigasi Flatpickr */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2 text-center">
          Pilih Bulan
        </label>
        <Flatpickr
          value={selectedDate}
          onChange={handleMonthChange}
          options={{
            dateFormat: 'Y-m',
            view: 'month',
            plugins: [],
            allowInput: true,
            clickOpens: true,
            monthSelectorType: 'dropdown',
            yearSelectorType: 'dropdown',
            showMonths: 1,
            locale: {
              months: { longhand: bulanNama },
              weekdays: { shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] }
            }
          }}
          className="w-full p-3 text-center text-lg border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Pilih bulan..."
        />
      </div>

      {/* Info Bulan & Tahun */}
      <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
        {bulanNama[currentMonth]} {currentYear}
      </h3>

      {/* Kalender Grid */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Header Hari */}
        <div className="grid grid-cols-7 bg-gray-100">
          {hariNama.map((hari) => (
            <div key={hari} className="p-2 text-center font-semibold text-gray-700 border-b">
              {hari}
            </div>
          ))}
        </div>

        {/* Isi Tanggal */}
        <div>
          {calendar.map((week, i) => (
            <div key={i} className="grid grid-cols-7">
              {week.map((cell, j) => (
                <div
                  key={j}
                  className={`p-2 text-center border-b border-gray-200 text-sm ${
                    cell.type === 'current'
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-400 text-xs italic'
                  } ${
                    cell.type === 'current' && cell.day === new Date().getDate() &&
                    currentMonth === new Date().getMonth() &&
                    currentYear === new Date().getFullYear()
                      ? 'bg-blue-100 font-bold text-blue-800 rounded-sm'
                      : ''
                  }`}
                >
                  {cell.day}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center mt-4 text-xs text-gray-500">
        Kalender menunjukkan {bulanNama[currentMonth]} {currentYear}
      </p>
    </div>
  );
};

export default KalenderNavigasi;
