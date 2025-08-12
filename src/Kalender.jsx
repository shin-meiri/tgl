import React, { useState, useRef, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const flatpickrRef = useRef(null);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const years = Array.from({ length: 101 }, (_, i) => 2020 + i); // 2020 - 2120

  // Update date when dropdowns change
  const handleDropdownChange = () => {
    const day = parseInt(document.getElementById('day').value);
    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);

    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);

    // Update flatpickr view
    if (flatpickrRef.current) {
      flatpickrRef.current.flatpickr.setDate(newDate, false); // false = jangan trigger event
    }
  };

  // Update dropdowns when date selected in calendar
  const handleDateChange = (date) => {
    setSelectedDate(date[0]);
    // Kalender otomatis update tampilan
  };

  // Set default: hari ini
  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    if (flatpickrRef.current) {
      flatpickrRef.current.flatpickr.setDate(today, false);
    }
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h3>Pilih Tanggal</h3>

      {/* Dropdown Tgl, Bulan, Tahun */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div>
          <label>Tgl:</label>
          <select
            id="day"
            defaultValue={selectedDate.getDate()}
            onChange={handleDropdownChange}
            style={{ marginLeft: '5px' }}
          >
            {days.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Bulan:</label>
          <select
            id="month"
            defaultValue={selectedDate.getMonth()}
            onChange={handleDropdownChange}
            style={{ marginLeft: '5px' }}
          >
            {months.map((m, idx) => (
              <option key={idx} value={idx}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Tahun:</label>
          <select
            id="year"
            defaultValue={selectedDate.getFullYear()}
            onChange={handleDropdownChange}
            style={{ marginLeft: '5px' }}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kalender Inline (Flatpickr) */}
      <div>
        <Flatpickr
          ref={flatpickrRef}
          options={{
            inline: true,
            defaultDate: selectedDate,
            onChange: handleDateChange,
            animate: true,
            // Hapus tombol prev/next
            prevArrow: '',
            nextArrow: '',
            // Custom fungsi render untuk menghilangkan nav lengkap
            onMonthChange: (selectedDates) => {
              const date = selectedDates[0] || selectedDate;
              document.getElementById('day').value = date.getDate();
              document.getElementById('month').value = date.getMonth();
              document.getElementById('year').value = date.getFullYear();
            },
            onYearChange: (selectedDates) => {
              const date = selectedDates[0] || selectedDate;
              document.getElementById('day').value = date.getDate();
              document.getElementById('month').value = date.getMonth();
              document.getElementById('year').value = date.getFullYear();
            }
          }}
        />
      </div>

      <p style={{ marginTop: '20px' }}>
        <strong>Tanggal Terpilih:</strong> {selectedDate.toLocaleDateString('id-ID')}
      </p>
    </div>
  );
};

export default DatePicker;
