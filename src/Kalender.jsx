// components/Kalender.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';
import axios from 'axios';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [wetonData, setWetonData] = useState({}); // { '2025-04-15': 'Kliwon', ... }
  const [loading, setLoading] = useState(false);

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  // Fungsi: generate hari-hari dalam bulan
  const generateCalendarDays = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tanggal dari bulan sebelumnya
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }

    // Tanggal dari bulan depan
    const totalDays = days.length;
    const remaining = 42 - totalDays; // 6 baris

    for (let day = 1; day <= remaining; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    setCalendarDays(days);
  }, []);

  // Ambil semua weton untuk bulan yang dipilih
  const fetchWetonBatch = useCallback(async (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JS: 0-indexed
    const key = `${year}-${String(month).padStart(2, '0')}`;

    setLoading(true);
    try {
      const response = await axios.get(`https://namasite.infinityfreeapp.com/api/get-weton-bulan.php`, {
        params: { bulan: key }, // Contoh: 2025-04
      });

      if (response.data.success) {
        // Format: { '2025-04-15': 'Kliwon' }
        setWetonData(response.data.data || {});
      }
    } catch (err) {
      console.warn(`Gagal ambil data weton untuk bulan ${key}`, err.message);
      // Tetap lanjut, tanpa weton
    } finally {
      setLoading(false);
    }
  }, []);

  // Update kalender & ambil data weton saat tanggal berubah
  useEffect(() => {
    generateCalendarDays(selectedDate);
    fetchWetonBatch(selectedDate);
  }, [selectedDate, generateCalendarDays, fetchWetonBatch]);

  // Handle perubahan dari Flatpickr
  const handleDateChange = useCallback((dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, []);

  // Format tanggal untuk lookup: 'YYYY-MM-DD'
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const displayMonthName = monthNames[currentMonth];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Navigasi Flatpickr */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Kalender Jawa</h2>

        <div className="w-full sm:w-64">
          <Flatpickr
            value={selectedDate}
            onChange={handleDateChange}
            options={{
              dateFormat: 'Y-m-d',
              altFormat: 'F Y',
              allowInput: false,
              clickOpens: true,
              mode: 'single',
              enableTime: false,
              time_24hr: true,
              monthSelectorType: 'dropdown',
              yearSelectorType: 'dropdown',
              defaultDate: selectedDate,
              locale: {
                firstDayOfWeek: 1,
                weekdays: {
                  shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                  longhand: dayNames,
                },
                months: {
                  shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                  longhand: monthNames,
                },
              },
            }}
            className="w-full p-3 text-center border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-blue-50 font-medium"
            placeholder="Pilih bulan/tahun"
          />
        </div>
      </div>

      {/* Info Bulan */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">
          {displayMonthName} {currentYear}
        </h3>
        {loading && <p className="text-sm text-blue-500">Memuat data weton...</p>}
      </div>

      {/* Tabel Kalender */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100">
              {dayNames.map((day) => (
                <th key={day} className="border border-gray-300 p-3 bg-blue-600 text-white font-semibold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, weekIndex) => {
              const start = weekIndex * 7;
              const end = start + 7;
              const week = calendarDays.slice(start, end);

              return (
                <tr key={weekIndex}>
                  {week.map((day, idx) => {
                    if (!day) return <td key={idx} className="border border-gray-300 p-3"></td>;

                    const dateNum = day.date.getDate();
                    const dateString = formatDate(day.date);
                    const isToday = new Date().toDateString() === day.date.toDateString();
                    const isCurrentMonth = day.isCurrentMonth;
                    const pasaran = wetonData[dateString] || (loading ? '...' : '');

                    return (
                      <td
                        key={idx}
                        className={`border border-gray-300 p-2 h-16 relative transition-colors
                          ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'hover:bg-blue-50'}
                          ${isToday ? 'bg-yellow-200' : ''}
                        `}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span
                            className={`block w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                              ${isToday ? 'bg-yellow-400 text-black' : 'text-gray-800'}
                            `}
                          >
                            {dateNum}
                          </span>
                          <span className="text-xs text-gray-600 mt-1">
                            {pasaran}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Data weton diambil dari backend. Gunakan navigasi untuk lihat bulan lain.
      </div>
    </div>
  );
};

export default Kalender;
