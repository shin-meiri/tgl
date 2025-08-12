import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Wajib: styling kalender

function DatePickerInput() {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default hari ini

  return (
    <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
      <label htmlFor="tanggal">Pilih Tanggal (mirip Excel):</label>
      
      <Flatpickr
        value={selectedDate}
        onChange={date => setSelectedDate(date[0])}
        options={{
          dateFormat: "Y-m-d",        // Format: YYYY-MM-DD
          altInput: true,             // Biar tampilan input lebih bagus
          altFormat: "F j, Y",        // Format alternatif di input (opsional)
          allowInput: false,          // Tidak boleh ketik manual (mirip Excel)
          clickOpens: true,           // Klik input → buka kalender (seperti dropdown)
          defaultDate: "today",       // Otomatis set ke hari ini
        }}
        className="form-control"
        placeholder="Klik untuk pilih tanggal..."
      />
      
      <p><strong>Tanggal terpilih:</strong> {selectedDate.toISOString().split('T')[0]}</p>
    </div>
  );
}

export default DatePickerInput;
