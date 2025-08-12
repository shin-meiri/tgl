import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/airbnb.css'; // Optional: tema bagus

const DateRangePicker = () => {
  const [datesDropdown, setDatesDropdown] = useState([]);
  const [datesInline, setDatesInline] = useState([]);
  const [durationDropdown, setDurationDropdown] = useState(null);
  const [durationInline, setDurationInline] = useState(null);

  // Format Indonesia: dd/mm/yyyy
  const dateFormat = 'd/m/Y';

  // Fungsi hitung durasi dalam hari
  const calculateDuration = (selectedDates) => {
    if (selectedDates.length < 2) return null;
    const [start, end] = selectedDates;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>📅 Uji Flatpickr: Dropdown vs Inline (Format dd/mm/yyyy)</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3>1. Dropdown Datepicker (Miris Excel)</h3>
        <Flatpickr
          value={datesDropdown}
          onChange={(selectedDates, dateStr, instance) => {
            setDatesDropdown(selectedDates);
            const duration = calculateDuration(selectedDates);
            setDurationDropdown(duration);
          }}
          options={{
            mode: 'range',
            dateFormat: dateFormat,
            locale: {
              firstDayOfWeek: 1, // Senin sebagai hari pertama
            },
          }}
          placeholder="Pilih rentang tanggal..."
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <div style={{ marginTop: '10px' }}>
          <strong>Dipilih:</strong> {datesDropdown.length > 0 ? datesDropdown.map(d => d.toLocaleDateString('id-ID')).join(' s/d ') : '-'}
        </div>
        <div>
          <strong>Durasi:</strong> {durationDropdown !== null ? `${durationDropdown} hari` : 'Belum lengkap'}
        </div>
      </div>

      <hr />

      <div>
        <h3>2. Inline Datepicker</h3>
        <Flatpickr
          value={datesInline}
          onChange={(selectedDates, dateStr, instance) => {
            setDatesInline(selectedDates);
            const duration = calculateDuration(selectedDates);
            setDurationInline(duration);
          }}
          options={{
            mode: 'range',
            inline: true,
            dateFormat: dateFormat,
            locale: {
              firstDayOfWeek: 1,
            },
          }}
        />
        <div style={{ marginTop: '10px' }}>
          <strong>Dipilih:</strong> {datesInline.length > 0 ? datesInline.map(d => d.toLocaleDateString('id-ID')).join(' s/d ') : '-'}
        </div>
        <div>
          <strong>Durasi:</strong> {durationInline !== null ? `${durationInline} hari` : 'Belum lengkap'}
        </div>
      </div>

      {/* Optional: tombol uji kirim ke backend */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => {
            const data = {
              dropdown: durationDropdown,
              inline: durationInline,
              time: new Date().toISOString(),
            };
            console.log('Data siap kirim ke API:', data);
            // axios.post('/api/log.php', data) // contoh
          }}
        >
          📤 Simpan / Uji Kirim Data
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;
