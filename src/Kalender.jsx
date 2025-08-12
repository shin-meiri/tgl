import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Kalender = () => {
  // State: tanggal yang dipilih
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Konversi ke objek tanggal
  const selected = new Date(selectedDate);

  // Dapatkan bulan & tahun dari tanggal terpilih
  const month = selected.getMonth(); // 0-11
  const year = selected.getFullYear();

  // Nama hari (Indonesia)
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Nama bulan
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Buat array tanggal untuk 1 bulan
  const renderCalendar = () => {
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const weeks = [];
    let days = [];

    // Isi awal dengan tanggal dari bulan sebelumnya
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div
          key={`prev-${i}`}
          style={styles.dayInactive}
        >
          {prevMonthDays - i}
        </div>
      );
    }

    // Tanggal bulan ini
    for (let date = 1; date <= daysInMonth; date++) {
      const isToday = new Date().toDateString() === new Date(year, month, date).toDateString();
      days.push(
        <div
          key={date}
          style={isToday ? styles.dayToday : styles.dayActive}
        >
          {date}
        </div>
      );

      // Setiap 7 hari, mulai baris baru
      if ((date + firstDay) % 7 === 0 || date === daysInMonth) {
        // Tambahkan sisa hari ke minggu depan jika belum 7
        while (days.length < 7) {
          const nextDate = days.length - (prevMonthDays - firstDay + date) + 1;
          days.push(
            <div key={`next-${nextDate}`} style={styles.dayInactive}>
              {nextDate}
            </div>
          );
        }
        weeks.push(
          <div key={weeks.length} style={styles.week}>
            {days}
          </div>
        );
        days = [];
      }
    }

    return weeks;
  };

  return (
    <div style={styles.container}>
      {/* === DATEPICKER === */}
      <div style={styles.pickerWrapper}>
        <span style={styles.icon}>🗓️</span>
        <Flatpickr
          options={{
            dateFormat: 'Y-m-d',
            defaultDate: selectedDate,
            onChange: (dates) => {
              if (dates.length > 0) {
                setSelectedDate(dates[0]);
              }
            },
            allowInput: true,
          }}
          render={({ value, ...props }, ref) => (
            <input
              ref={ref}
              style={styles.input}
              value={value}
              placeholder="Pilih tanggal"
              readOnly
              {...props}
            />
          )}
        />
      </div>

      {/* === KALENDER STATIS BULANAN === */}
      <div style={styles.calendarContainer}>
        {/* Header Bulan */}
        <div style={styles.monthHeader}>
          {monthNames[month]} {year}
        </div>

        {/* Nama Hari */}
        <div style={styles.week}>
          {dayNames.map((day) => (
            <div key={day} style={styles.dayHeader}>
              {day}
            </div>
          ))}
        </div>

        {/* Tanggal-tanggal */}
        {renderCalendar()}
      </div>
    </div>
  );
};

// === STYLES (inline) ===
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
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    cursor: 'pointer',
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
    cursor: 'pointer',
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
