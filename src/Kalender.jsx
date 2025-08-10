// components/Kalender.jsx
import React, { useState, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [detailWeton, setDetailWeton] = useState(null); // Untuk tampilkan detail
  const [loading, setLoading] = useState(false);

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // === Fungsi Hitung Pasaran ===
  const hitungPasaran = (date) => {
    const pasaranList = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
    const selisihHari = Math.floor((date - new Date(1900, 0, 1)) / (1000 * 60 * 60 * 24));
    const pasaranIndex = selisihHari % 5;
    return pasaranList[pasaranIndex];
  };

  // === Generate Kalender ===
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // 1. Bulan lalu
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, prevMonthDays - i);
      days.push({
        date: prevMonthDays - i,
        isCurrent: false,
        day: d.getDay(),
        pasaran: hitungPasaran(d),
        fullDate: d,
      });
    }

    // 2. Bulan ini
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentYear, currentMonth, i);
      days.push({
        date: i,
        isCurrent: true,
        day: d.getDay(),
        pasaran: hitungPasaran(d),
        fullDate: d,
      });
    }

    // 3. Bulan depan (✅ sudah diperbaiki)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    const nextMonthYear = nextMonth.getFullYear();
    const nextMonthIndex = nextMonth.getMonth();

    for (let i = days.length; i < totalCells; i++) {
      const dateNum = i - days.length + 1;
      const d = new Date(nextMonthYear, nextMonthIndex, dateNum);
      days.push({
        date: dateNum,
        isCurrent: false,
        day: d.getDay(),
        pasaran: hitungPasaran(d),
        fullDate: d,
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const handleDateChange = (dates) => {
    setSelectedDate(dates[0]);
    setDetailWeton(null); // Reset saat ganti bulan
  };

  // === Saat klik tanggal ===
  const handleClickDate = async (cell) => {
    const { fullDate, pasaran, date } = cell;
    const hari = hariList[fullDate.getDay()];
    const formattedDate = fullDate.toISOString().split('T')[0]; // YYYY-MM-DD

    setLoading(true);
    try {
      const response = await fetch(`https://namasite.infinityfreeapp.com/get-weton-by-date.php?tgl=${formattedDate}`);
      const data = await response.json();

      if (data.success) {
        setDetailWeton({
          ...data.data,
          tanggal: date,
          hari,
          pasaran,
          formattedDate,
        });
      } else {
        setDetailWeton({
          error: data.message || 'Data weton tidak ditemukan',
        });
      }
    } catch (err) {
      setDetailWeton({ error: 'Gagal terhubung ke server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Judul */}
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Kalender Jawa</h3>

      {/* Navigasi */}
      <div className="mb-6 text-center">
        <Flatpickr
          value={selectedDate}
          onChange={handleDateChange}
          options={{
            dateFormat: 'Y-m-d',
            altFormat: 'F Y',
            monthSelectorType: 'dropdown',
            yearSelectorType: 'dropdown',
            clickOpens: true,
            allowInput: false,
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

      {/* Tabel Kalender */}
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white uppercase text-sm">
            {weekDays.map(day => <th key={day} className="py-3 border border-gray-400">{day}</th>)}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, week) => {
            const start = week * 7;
            const weekDays = calendarDays.slice(start, start + 7);
            return (
              <tr key={week}>
                {weekDays.map((cell, idx) => (
                  <td
                    key={idx}
                    onClick={() => cell.isCurrent && handleClickDate(cell)}
                    className={`
                      border border-gray-300 h-20 align-top p-2 text-center cursor-pointer
                      ${cell.isCurrent ? 'bg-white hover:bg-yellow-100' : 'bg-gray-100 text-gray-400'}
                      transition
                    `}
                  >
                    <div className="font-bold text-gray-800">{cell.date}</div>
                    <div className="text-xs text-green-700 font-medium mt-1">{cell.pasaran}</div>
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

      {/* Detail Weton (muncul setelah klik) */}
      {loading && (
        <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-center">
          Memuat data weton...
        </div>
      )}

      {detailWeton && !loading && (
        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-gray-200 rounded-xl shadow-inner">
          <h4 className="text-xl font-bold text-gray-800 mb-4">Detail Weton: {detailWeton.tanggal} {detailWeton.hari} {detailWeton.pasaran}</h4>

          {detailWeton.error ? (
            <p className="text-red-600">{detailWeton.error}</p>
          ) : (
            <div className="space-y-3 text-gray-700">
              <p><strong>Hari:</strong> {detailWeton.hari}</p>
              <p><strong>Pasaran:</strong> {detailWeton.pasaran}</p>
              <p><strong>Weton:</strong> {detailWeton.nama_weton}</p>
              <p><strong>Total Neptu:</strong> {detailWeton.total_neptu}</p>
              <p><strong>Watak:</strong> {detailWeton.watak_umum}</p>
              <p><strong>Rezeki:</strong> {detailWeton.rezeki}</p>
              <p><strong>Jodoh Baik:</strong> {detailWeton.jodoh_baik || '-'}</p>
              <p><strong>Umur (Neptu):</strong> {detailWeton.umur} tahun</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Kalender;
