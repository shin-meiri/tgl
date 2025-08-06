import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'flatpickr/dist/flatpickr.min.css';
import './Kalender.css';

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [loading, setLoading] = useState(false);

  const hariNama = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const bulanNama = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const bulanPanjang = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const pasaran = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'];

  // Gunakan useCallback agar fungsi tidak berubah tiap render
  const getWeton = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    const selisih = jd - 2440588; // 1 Jan 1970
    const pasaranIndex = (4 + selisih) % 5;
    return pasaran[pasaranIndex];
  }, []);

  // Fungsi generateCalendarDays di-wrap useCallback
  const generateCalendarDays = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Tanggal dari bulan sebelumnya
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        dayOfWeek: d.getDay(),
        weton: getWeton(d),
      });
    }

    // Tanggal bulan ini
    for (let day = 1; day <= daysCount; day++) {
      const d = new Date(year, month, day);
      days.push({
        date: day,
        isCurrentMonth: true,
        dayOfWeek: d.getDay(),
        weton: getWeton(d),
      });
    }

    // Tanggal dari bulan depan
    const totalCells = days.length;
    const remaining = 42 - totalCells;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      days.push({
        date: day,
        isCurrentMonth: false,
        dayOfWeek: d.getDay(),
        weton: getWeton(d),
      });
    }

    setDaysInMonth(days);
  }, [getWeton]); // ✅ Dependensi: getWeton

  // ✅ Sekarang aman: generateCalendarDays stabil karena useCallback
  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate, generateCalendarDays]); // ✅ Tambahkan sebagai dependensi

  // API call
  useEffect(() => {
    setLoading(true);
    axios
      .get('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then(res => console.log('Data loaded:', res.data))
      .catch(err => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, [currentDate]);

  // ... (sisanya tetap sama: navigasi, picker, dll)
  // (kode UI tidak berubah, jadi tidak ditulis ulang di sini)

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    // ... (return JSX yang sama seperti sebelumnya)
    // Pastikan Anda masih menggunakan kode JSX terakhir yang ada weton dan struktur yang benar
  );
};

export default Kalender;
