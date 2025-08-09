// src/components/Kalender.jsx
import React, { useState, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Nama hari (Minggu - Sabtu)
  const weekDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Generate hari-hari dalam bulan
  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=Min
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const result = [];

    // Hari dari bulan lalu
    for (let i = firstDay - 1; i >= 0; i--) {
      result.push({ date: prevMonthDays - i, isCurrent: false });
    }

    // Hari bulan ini
    for (let i = 1; i <= daysInMonth; i++) {
      result.push({ date: i, isCurrent: true });
    }

    // Total sel = kelipatan 7
    const totalCells = Math.ceil(result.length / 7) * 7;

    // Hari dari bulan depan
    for (let i = result.length; i < totalCells; i++) {
      result.push({ date: i - result.length + 1, isCurrent: false });
    }

    return result;
  }, [currentMonth, currentYear]);

  // Saat user pilih bulan/tahun di Flatpickr
  const handleChange = (dateArray) => {
    setSelectedDate(dateArray[0]);
  };

  return (
    <div className="calendar-container">
      {/* Navigasi dengan Flatpickr */}
      <Flatpickr
        value={selectedDate}
        onChange={handleChange}
        options={{
          dateFormat: 'Y-m-d',
          altFormat: 'F Y',
          allowInput: false,
          clickOpens: true,
          mode: 'single',
          showMonths: 1,
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
          inline: false,
        }}
        className="flatpickr-input"
        placeholder="Pilih bulan..."
      />

      {/* Tabel Kalender */}
      <table>
        <thead>
          <tr>
            {weekDays.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(days.length / 7) }).map((_, week) => {
            const start = week * 7;
            const weekDays = days.slice(start, start + 7);
            return (
              <tr key={week}>
                {weekDays.map((day, idx) => (
                  <td
                    key={idx}
                    className={day.isCurrent ? 'current-month' : 'other-month'}
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
  );
};

export default Kalender;
