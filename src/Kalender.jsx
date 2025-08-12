import React, { useState, useRef, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const CalendarNavigator = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth()); // 0-11
  const [year, setYear] = useState(today.getFullYear());
  const [currentDate, setCurrentDate] = useState(today);

  const flatpickrRef = useRef(null);

  // Daftar nama bulan dan hari
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Daftar tahun (opsional: range 10 tahun ke depan & belakang)
  const years = Array.from({ length: 21 }, (_, i) => today.getFullYear() - 10 + i);

  // Update kalender saat bulan/tahun berubah
  useEffect(() => {
    if (flatpickrRef.current) {
      const fp = flatpickrRef.current.flatpickr;
      fp.setDate(new Date(year, month, 1), false); // false = jangan trigger event
      fp.redraw(); // refresh tampilan
      fp.jumpToDate(new Date(year, month, 1)); // lompat ke bulan/tahun
    }
  }, [month, year]);

  // Handle perubahan tanggal dari flatpickr (klik tanggal)
  const handleDateChange = (selectedDates) => {
    if (selectedDates.length > 0) {
      setCurrentDate(new Date(selectedDates[0]));
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* Judul */}
      <h3>Navigasi Kalender</h3>

      {/* Dropdown Bulan & Tahun */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>Bulan: </label>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          style={{ padding: '5px' }}
        >
          {monthNames.map((name, idx) => (
            <option key={idx} value={idx}>
              {name}
            </option>
          ))}
        </select>

        <label>Tahun: </label>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          style={{ padding: '5px' }}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Label Hari dalam Seminggu */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          fontWeight: 'bold',
          backgroundColor: '#f0f0f0',
          padding: '8px 0',
          marginBottom: '5px',
        }}
      >
        {dayNames.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Kalender Inline dengan Flatpickr */}
      <Flatpickr
        ref={flatpickrRef}
        options={{
          inline: true,
          monthSelectorType: 'static',
          showMonths: 1,
          defaultDate: currentDate,
          onChange: handleDateChange,
          onReady: (selectedDates, dateStr, instance) => {
            // Pastikan tampilan sesuai dropdown saat pertama kali
            instance.jumpToDate(new Date(year, month, 1));
          },
        }}
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default CalendarNavigator;
