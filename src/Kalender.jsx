import React, { useState, useRef, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const daysInWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const monthsInYear = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Fungsi: Tambahkan offset +622 tahun dan -3 hari
const applyOffset = (date) => {
  const offsetDate = new Date(date);
  offsetDate.setFullYear(offsetDate.getFullYear() + 622);
  offsetDate.setDate(offsetDate.getDate() - 3);
  return offsetDate;
};

// Fungsi: Kembalikan ke tanggal asli dari offset
const removeOffset = (offsetDate) => {
  const original = new Date(offsetDate);
  original.setDate(original.getDate() + 3);
  original.setFullYear(original.getFullYear() - 622);
  return original;
};

const CalendarNavigator = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bulan, setBulan] = useState(new Date().getMonth());
  const [tahun, setTahun] = useState(new Date().getFullYear());

  const calendarRef = useRef(null);
  const flatpickrInstance = useRef(null);

  // Inisialisasi Flatpickr inline
  useEffect(() => {
    const fp = flatpickr(calendarRef.current, {
      inline: true,
      defaultDate: applyOffset(selectedDate),
      onChange: (selectedDates) => {
        const corrected = removeOffset(selectedDates[0]);
        setSelectedDate(corrected);
        setBulan(corrected.getMonth());
        setTahun(corrected.getFullYear());
      },
      // Hapus navigasi prev/next
      showMonths: 1,
      prevArrow: '',
      nextArrow: '',
      onMonthChange: (selectedDates, dateStr, instance) => {
        // Simpan bulan & tahun ke state
        const corrected = removeOffset(instance.currentMonthDate);
        setBulan(corrected.getMonth());
        setTahun(corrected.getFullYear());
      },
      onYearChange: (selectedDates, dateStr, instance) => {
        const corrected = removeOffset(instance.currentYear);
        setTahun(corrected.getFullYear());
      }
    });

    flatpickrInstance.current = fp;

    return () => fp.destroy();
  }, []);

  // Update kalender saat dropdown berubah
  useEffect(() => {
    const tempDate = new Date(tahun, bulan, 1);
    const offsetDate = applyOffset(tempDate);
    if (flatpickrInstance.current) {
      flatpickrInstance.current.jumpToDate(offsetDate);
    }
    // Set tanggal pertama bulan sebagai selected
    setSelectedDate(new Date(tahun, bulan, 1));
  }, [bulan, tahun]);

  // Handle dropdown change
  const handleBulanChange = (e) => setBulan(Number(e.target.value));
  const handleTahunChange = (e) => setTahun(Number(e.target.value));

  // Tanggal offset untuk ditampilkan
  const displayDate = applyOffset(selectedDate);
  const displayBulan = monthsInYear[displayDate.getMonth()];
  const displayTahun = displayDate.getFullYear();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* Dropdown Navigasi */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>
          <strong>Tanggal:</strong>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            style={{ marginLeft: '5px', padding: '5px' }}
          />
        </label>

        <label>
          <strong>Bulan:</strong>
          <select value={bulan} onChange={handleBulanChange} style={{ marginLeft: '5px' }}>
            {monthsInYear.map((m, idx) => (
              <option key={idx} value={idx}>{m}</option>
            ))}
          </select>
        </label>

        <label>
          <strong>Tahun:</strong>
          <input
            type="number"
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
            style={{ width: '80px', marginLeft: '5px' }}
          />
        </label>
      </div>

      {/* Hari dalam Minggu */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
        padding: '10px 0',
        marginBottom: '10px'
      }}>
        {daysInWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Kalender Inline (Flatpickr) */}
      <div ref={calendarRef} style={{ maxWidth: '300px', margin: '0 auto' }} />

      <p style={{ marginTop: '1rem', fontSize: '14px', color: 'gray' }}>
        <strong>Tanggal ditampilkan:</strong> {displayDate.getDate()} {displayBulan} {displayTahun}{' '}
        <em>(+622 tahun, -3 hari dari aslinya)</em>
      </p>
    </div>
  );
};

export default CalendarNavigator;
