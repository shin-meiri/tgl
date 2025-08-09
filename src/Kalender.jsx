// components/Kalender.jsx
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css'; // Tema biru elegan

const Kalender = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (selectedDates) => {
    const date = selectedDates[0];
    if (date) {
      setSelectedDate(date);
      const formatted = date.toISOString().split('T')[0]; // YYYY-MM-DD

      // Kirim ke parent component
      if (onDateSelect) {
        onDateSelect(formatted, date);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mx-auto max-w-4xl">
      <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
        Kalender Weton Jawa
      </h3>

      <div className="flatpickr-standalone">
        <Flatpickr
          value={selectedDate}
          onChange={handleDateChange}
          options={{
            // 🔹 Mode: tampilkan kalender sebulan penuh (inline)
            inline: true,

            // 🔹 Format tanggal
            dateFormat: 'Y-m-d',
            altFormat: 'd F Y',

            // 🔹 Dropdown bulan & tahun (seperti Excel)
            monthSelectorType: 'dropdown',
            yearSelectorType: 'select', // dropdown tahun

            // 🔹 Lokal bahasa Indonesia
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
                  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
                ],
                longhand: [
                  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
                ],
              },
            },

            // 🔹 Navigasi
            showMonths: 1, // Hanya 1 bulan
          }}

          // 🔹 Styling tambahan
          className="mx-auto"
        />
      </div>

      {/* Info Tanggal Terpilih */}
      {selectedDate && (
        <div className="mt-4 text-center text-sm text-gray-600">
          <strong>Tanggal Terpilih:</strong>{' '}
          {selectedDate.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      )}
    </div>
  );
};

export default Kalender;
