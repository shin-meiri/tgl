// components/KalenderNavigasi.jsx
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const KalenderNavigasi = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Ambil bulan & tahun dari selectedDate
  const selectedMonth = selectedDate.getMonth(); // 0-11
  const selectedYear = selectedDate.getFullYear();

  // Hari dalam seminggu (Indonesia)
  const daysShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const daysLong = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthsLong = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Dapatkan semua tanggal dalam bulan yang dipilih
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];

    // Tanggal dari akhir bulan lalu (jika bulan dimulai bukan dari Minggu)
    const firstDay = date.getDay(); // 0 (Minggu) - 6 (Sabtu)
    const prevMonth = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: prevMonth - i, isCurrentMonth: false });
    }

    // Tanggal bulan ini
    while (date.getMonth() === month) {
      days.push({ date: date.getDate(), isCurrentMonth: true });
      date.setDate(date.getDate() + 1);
    }

    // Tanggal awal bulan depan (untuk melengkapi grid 6x7)
    const remaining = 42 - days.length; // 6 baris × 7 kolom
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: i, isCurrentMonth: false });
    }

    return days;
  };

  const days = getDaysInMonth(selectedYear, selectedMonth);

  // Handle perubahan tanggal dari Flatpickr
  const handleDateChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Flatpickr sebagai Navigasi */}
      <div className="p-4 bg-blue-600 text-white">
        <Flatpickr
          value={selectedDate}
          onChange={handleDateChange}
          options={{
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'd F Y',
            clickOpens: true,
            allowInput: false,
            monthSelectorType: 'dropdown',
            yearSelectorType: 'dropdown',
            showMonths: 1,
            locale: {
              firstDayOfWeek: 1,
              weekdays: { shorthand: daysShort, longhand: daysLong },
              months: { longhand: monthsLong },
            },
            onChange: (selectedDates) => {
              if (selectedDates.length > 0) {
                setSelectedDate(selectedDates[0]);
              }
            },
          }}
          className="w-full p-2 text-center text-lg rounded cursor-pointer bg-white text-gray-800"
          placeholder="Pilih tanggal..."
        />
      </div>

      {/* Kalender Grid Manual */}
      <div className="p-4">
        <h3 className="text-center text-lg font-bold mb-3 text-gray-800">
          {monthsLong[selectedMonth]} {selectedYear}
        </h3>

        {/* Header Hari */}
        <div className="grid grid-cols-7 gap-1 mb-1 text-xs font-semibold text-center text-blue-700">
          {daysShort.map((day) => (
            <div key={day} className="p-2 bg-blue-50 rounded">
              {day}
            </div>
          ))}
        </div>

        {/* Grid Tanggal */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`
                p-2 border rounded text-sm transition
                ${day.isCurrentMonth
                  ? 'text-gray-800 hover:bg-blue-100'
                  : 'text-gray-400'
                }
                ${new Date(selectedYear, selectedMonth, day.date).toDateString() === new Date().toDateString()
                  ? 'bg-green-100 border-green-300 font-bold'
                  : 'border-transparent'
                }
              `}
            >
              {day.date}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KalenderNavigasi;
