import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Tetap butuh CSS dasar

const Kalender = () => {
  // State: tanggal yang dipilih (default hari ini)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Konversi ke objek tanggal
  const selected = new Date(selectedDate);
  const month = selected.getMonth();   // 0-11
  const year = selected.getFullYear();

  // Nama hari (Indonesia)
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Nama bulan (Indonesia)
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // === FUNGSI: Render Kalender 6x7 (42 kotak) ===
  const renderCalendar = () => {
    const firstDate = new Date(year, month, 1);
    const startDate = new Date(firstDate);
    
    // Mundur ke Minggu minggu pertama
    const dayOffset = firstDate.getDay(); // 0 = Minggu
    startDate.setDate(startDate.getDate() - dayOffset);

    const weeks = [];
    let days = [];
    const currentDate = new Date(startDate);

    // Loop 6 minggu × 7 hari = 42 kotak
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = new Date().toDateString() === currentDate.toDateString();

      days.push(
        <div
          key={currentDate.toISOString().split('T')[0]} // YYYY-MM-DD
          style={isCurrentMonth ? (isToday ? styles.dayToday : styles.dayActive) : styles.dayInactive}
        >
          {currentDate.getDate()}
        </div>
      );

      // Setiap 7 hari, buat baris baru
      if ((i + 1) % 7 === 0) {
        weeks.push(
          <div key={`week-${i}`} style={styles.week}>
            {days}
          </div>
        );
        days = [];
      }

      // Tambah 1 hari
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return weeks;
  };

  return (
    <div style={styles.container}>
      {/* === DATEPICKER (Input + Ikon) === */}
      <div style={styles.pickerWrapper}>
        <span style={styles.icon}>🗓️</span>
        <Flatpickr
          options={{
            dateFormat: 'Y-m-d',
            defaultDate: selectedDate,
            onChange: (dates) => {
              if (dates.length > 0) {
                setSelectedDate(new Date(dates[0])); // Pastikan Date object
              }
            },
            allowInput: true,
            clickOpens: true,
          }}
          render={({ value, ...props }, ref) => (
            <input
              ref={ref}
              type="text"
              style={styles.input}
              value={value || ''}
              placeholder="Pilih tanggal"
              readOnly
              {...props}
            />
          )}
        />
      </div>

      {/* === KALENDER BULANAN (Statik di bawah) === */}
      <div style={styles.calendarContainer}>
        {/* Header: Nama Bulan + Tahun */}
        <div style={styles.monthHeader}>
          {monthNames[month]} {year}
        </div>

        {/* Nama Hari (Header) */}
        <div style={styles.week}>
          {dayNames.map((day) => (
            <div key={day} style={styles.dayHeader}>
              {day}
            </div>
          ))}
        </div>

        {/* Grid Tanggal (6 baris) */}
        {renderCalendar()}
      </div>
    </div>
  );
};

// === STYLES (Inline, Tanpa File CSS) ===
const styles = {
  container: {
    display: 'inline-block',
    fontFamily: 'Arial, sans-serif',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    width: '320px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    userSelect: 'none',
  },
  pickerWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    border: '1px solid #aaa',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  icon: {
    padding: '8px',
    fontSize: '16px',
    backgroundColor: '#f0f0f0',
    borderRight: '1px solid #ccc',
    cursor: 'pointer',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer',
    backgroundColor: '#fff',
  },
  calendarContainer: {
    marginTop: '8px',
  },
  monthHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '8px',
    color: '#333',
  },
  week: {
    display: 'flex',
    flexDirection: 'row',
  },
  dayHeader: {
    flex: 1,
    padding: '6px 0',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '12px',
    color: '#555',
    backgroundColor: '#f7f7f7',
    border: '1px solid #eee',
  },
  dayActive: {
    flex: 1,
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: '13px',
    color: '#333',
    cursor: 'default',
  },
  dayInactive: {
    flex: 1,
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: '13px',
    color: '#ccc',
    cursor: 'default',
  },
  dayToday: {
    flex: 1,
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: '13px',
    color: '#fff',
    backgroundColor: '#1890ff',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
};

export default Kalender;
