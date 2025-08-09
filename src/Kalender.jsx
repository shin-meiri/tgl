// components/Kalender.jsx
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Kalender = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (selectedDates) => {
    const date = selectedDates[0];
    setSelectedDate(date);

    if (onDateSelect && date) {
      const formatted = date.toISOString().split('T')[0];
      onDateSelect(formatted, date);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
      <label className="block text-gray-700 font-semibold mb-3 text-center">
        📅 Pilih Tanggal Lahir
      </label>

      <Flatpickr
        value={selectedDate}
        onChange={handleDateChange}
        options={{
          dateFormat: 'Y-m-d',
          altInput: true,
          altFormat: 'd F Y',
          allowInput: false,
          clickOpens: true,
          disableMobile: false,

          // 🔽 1 Bulan Saja
          showMonths: 1,

          // 🔽 Navigasi: Tampilkan panah di kiri & kanan
          prevArrow: '<span style="font-size: 20px; margin: 0 8px;">⬅️</span>',
          nextArrow: '<span style="font-size: 20px; margin: 0 8px;">➡️</span>',

          // 🔽 Dropdown bulan & tahun (seperti Excel)
          monthSelectorType: 'dropdown',
          yearSelectorType: 'dropdown',

          // 🔽 Mulai dari Minggu
          firstDayOfWeek: 0, // 0 = Minggu, 1 = Senin

          // 🔽 Lokal Bahasa Indonesia
          locale: {
            firstDayOfWeek: 0,
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
              shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
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
        className="w-full p-3 text-center text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        placeholder="Pilih tanggal..."
      />

      <p className="text-center mt-4 text-sm text-gray-500">
        Gunakan panah ⬅️ ➡️ untuk ganti bulan
      </p>
    </div>
  );
};

export default Kalender;
