import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selected = new Date(selectedDate);
  const month = selected.getMonth();
  const year = selected.getFullYear();

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const renderCalendar = () => {
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const weeks = [];
    let days = [];

    // 1. Tanggal dari bulan sebelumnya
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} style={styles.dayInactive}>
          {prevMonthDays - i}
        </div>
      );
    }

    // 2. Tanggal bulan ini
    for (let date = 1; date <= daysInMonth; date++) {
      const isToday = new Date().toDateString() === new Date(year, month, date).toDateString();
      days.push(
        <div key={`curr-${date}`} style={isToday ? styles.dayToday : styles.dayActive}>
          {date}
        </div>
      );

      if ((date + firstDay) % 7 === 0) {
        weeks.push(
          <div key={weeks.length} style={styles.week}>
            {days}
          </div>
        );
        days = [];
      }
    }

    // 3. Tanggal dari bulan depan
    let nextDate = 1;
    while (days.length < 7) {
      days.push(
        <div key={`next-${nextDate}`} style={styles.dayInactive}>
          {nextDate++}
        </div>
      );
    }

    if (days.length > 0) {
      weeks.push(
        <div key={weeks.length} style={styles.week}>
          {days}
        </div>
      );
    }

    return weeks;
  };

  return (
    <div style={styles.container}>
      {/* DATEPICKER */}
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

      {/* KALENDER BULANAN */}
      <div style={styles.calendarContainer}>
        <div style={styles.monthHeader}>
          {monthNames[month]} {year}
        </div>

        <div style={styles.week}>
          {dayNames.map((day) => (
            <div key={day} style={styles.dayHeader}>
              {day}
            </div>
          ))}
        </div>

        {renderCalendar()}
      </div>
    </div>
  );
};

// STYLES (sama seperti sebelumnya)
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
