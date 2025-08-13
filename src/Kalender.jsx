// Kalender.jsx
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default function Kalender() {
  const [tanggal, setTanggal] = useState('0622-08-10'); // Default: 10 Agustus 622
  const [rawValue, setRawValue] = useState('0622-08-10'); // Simpan nilai asli dari flatpickr

  const handleChange = (selectedDates, dateStr) => {
    // 🔑 Ambil langsung string dari flatpickr
    setTanggal(dateStr);
    setRawValue(dateStr); // Ini nilai asli dari datepicker
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h3>Kalender Historis (Nilai Asli Ditampilkan)</h3>

      <div style={{ marginBottom: '20px' }}>
        <label>Pilih Tanggal: </label>
        <Flatpickr
          value={tanggal}
          options={{
            dateFormat: 'Y-m-d',        // Format simpan & tampilan internal
            altFormat: 'F j, Y',        // Format di dropdown (opsional)
            allowInput: true,
            clickOpens: true,
          }}
          onChange={handleChange}
          className="flatpickr-input"
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Tampilkan nilai asli dari datepicker */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <h4>🔍 Nilai Asli dari Datepicker:</h4>
        <p style={{ fontSize: '18px', fontFamily: 'monospace', color: '#d32f2f' }}>
          <strong>{rawValue}</strong>
        </p>
        <p><em>Ini adalah nilai string langsung dari <code>dateStr</code> — tidak melalui <code>Date</code> object.</em></p>
      </div>

      {/* Info tambahan */}
      <div style={{ marginTop: '20px', color: '#555', fontSize: '14px' }}>
        <p>✅ <strong>Benar:</strong> Nilai ini tidak akan bergeser (misal: 10 → 13).</p>
        <p>🚫 <strong>Jangan gunakan:</strong> <code>selectedDates[0].toISOString()</code> — itu bisa rusak karena timezone.</p>
      </div>
    </div>
  );
            }
