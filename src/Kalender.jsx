// components/Kalender.jsx
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css'; // Tema bagus

const Kalender = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format: YYYY-MM-DD (untuk kirim ke backend)
  const handleDateChange = (selectedDates) => {
    const date = selectedDates[0];
    setSelectedDate(date);

    // Kirim ke parent (misal: App.js)
    if (onDateSelect && date) {
      const formatted = date.toISOString().split('T')[0]; // YYYY-MM-DD
      onDateSelect(formatted, date); // Kirim string & objek date
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto transition-transform hover:scale-102">
      <label className="block text-gray-700 font-semibold mb-3 text-center">
        Pilih Tanggal Lahir
      </label>

      <Flatpickr
        value={selectedDate}
        onChange={handleDateChange}
        options={{
          dateFormat: 'Y-m-d',
          altInput: true,
          altFormat: 'd F Y', // Tampilan: 15 April 2025
          allowInput: false,
          clickOpens: true,
          disableMobile: false, // Biar mobile juga pakai flatpickr
          // 🔽 Dropdown seperti Excel
          monthSelectorType: 'dropdown', // Bulan: dropdown
          static: false, // Kalender muncul inline jika di-hover
          showMonths: 1,
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
              shorthand: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'Mei',
                'Jun',
                'Jul',
                'Agu',
                'Sep',
                'Okt',
                'Nov',
                'Des',
              ],
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
        Klik kotak di atas untuk buka kalender
      </p>
    </div>
  );
};

export default Kalender;
