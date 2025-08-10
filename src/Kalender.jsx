// components/Kalender.jsx
import React, { useState, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// Fungsi: Hitung Pasaran & Weton
const hitungWeton = (date) => {
  const hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const pasaranList = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const neptuHari = { 'Minggu': 5, 'Senin': 4, 'Selasa': 3, 'Rabu': 7, 'Kamis': 8, 'Jumat': 6, 'Sabtu': 9 };
  const neptuPasaran = { 'Legi': 5, 'Pahing': 9, 'Pon': 7, 'Wage': 4, 'Kliwon': 8 };

  const dayIndex = date.getDay();
  const hari = hariList[dayIndex];

  // Hitung pasaran: 1 Jan 1900 = Jumat Pahing (acuan kalender Jawa)
  const selisihHari = Math.floor((date - new Date(1900, 0, 1)) / (1000 * 60 * 60 * 24));
  const pasaranIndex = selisihHari % 5;
  const pasaran = pasaranList[pasaranIndex];

  const totalNeptu = neptuHari[hari] + neptuPasaran[pasaran];

  return {
    hari,
    pasaran,
    weton: `${hari} ${pasaran}`,
    neptu: totalNeptu,
  };
};

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Bulan lalu
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, prevMonthDays - i);
      const w = hitungWeton(d);
      days.push({ date: prevMonthDays - i, isCurrent: false, weton: w });
    }

    // Bulan ini
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentYear, currentMonth, i);
      const w = hitungWeton(d);
      days.push({ date: i, isCurrent: true, fullDate: d, weton: w });
    }

    // Isi ke depan
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let i = days.length; i < totalCells; i++) {
      const nextDay = i - days.length + 1;
      const d = new Date(currentYear, currentMonth + 1, nextDay);
      const w = hitungWeton(d);
      days.push({ date: nextDay, isCurrent: false, weton: w });
    }

    return days;
  }, [currentMonth, currentYear]);

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const handleDateChange = (dates) => {
    setSelectedDate(dates[0]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 bg-header text-white py-3 rounded-lg">
        Kalender Jawa
      </h3>

      {/* Navigasi Flatpickr */}
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
                longhand: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
                shorthand: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ago','Sep','Okt','Nov','Des']
              },
              weekdays: {
                shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                longhand: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
              }
            },
            inline: false
          }}
          className="p-3 border-2 border-blue-400 rounded-lg text-lg font-medium bg-blue-50 text-blue-800 w-64"
        />
      </div>

      {/* Tabel Kalender Jawa */}
      <table className="w-full table-fixed border-collapse calendar-table">
        <thead>
          <tr className="bg-gray-800 text-white uppercase text-sm">
            {weekDays.map(day => (
              <th key={day} className="py-3 border border-gray-400">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, week) => {
            const start = week * 7;
            const weekDays = calendarDays.slice(start, start + 7);
            return (
              <tr key={week}>
                {weekDays.map((day, idx) => (
                  <td
                    key={idx}
                    className={`
                      border border-gray-300 h-20 align-top p-1 text-xs
                      ${day.isCurrent ? 'bg-white' : 'bg-gray-100 text-gray-400 italic'}
                      hover:bg-yellow-50 transition
                    `}
                  >
                    <div className="font-bold text-gray-800">{day.date}</div>
                    <div className="weton-cell text-blue-700 font-medium">
                      {day.weton.hari.slice(0,3)}
                    </div>
                    <div className="weton-cell text-green-700 text-xs">
                      {day.weton.pasaran}
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="text-center mt-4 text-sm text-gray-500">
        Menampilkan: <strong>{selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</strong>
      </p>
    </div>
  );
};

export default Kalender;
