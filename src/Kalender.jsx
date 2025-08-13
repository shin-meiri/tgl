// Kalender.jsx
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default function Kalender() {
  const [rawOutput, setRawOutput] = useState(null);

  const handleChange = (selectedDates, dateStr, instance) => {
    // 🔥 INI YANG KAMU MAU:
    // Tampilkan apa adanya dari flatpickr
    setRawOutput({
      dateStr,           // "0002-01-05" → inilah nilai asli
      selectedDatesLen: selectedDates.length,
      firstDate: selectedDates[0] ? selectedDates[0].toString() : null,
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h3>🔍 Kalender: Tampilkan Hasil Asli Datepicker (Apa Adanya)</h3>

      <p><em>Pilih tanggal — lihat output mentah dari flatpickr di bawah.</em></p>

      <div style={{ marginBottom: '30px' }}>
        <Flatpickr
          options={{
            dateFormat: 'Y-m-d',
            altFormat: 'F j, Y',
            allowInput: true,
            clickOpens: true,
          }}
          onChange={handleChange} // Tidak perlu value dulu
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '2px solid #000',
            borderRadius: '6px',
          }}
        />
      </div>

      {/* Tampilkan hasil APA ADANYA */}
      {rawOutput && (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '14px',
            whiteSpace: 'pre-wrap',
          }}
        >
          <strong>🔧 Hasil Asli dari Flatpickr (onChange):</strong>
          <pre style={{ margin: '10px 0', lineHeight: '1.6' }}>
{`dateStr (string): "${rawOutput.dateStr}"

Jumlah tanggal dipilih: ${rawOutput.selectedDatesLen}

Tanggal pertama (Date object):
${rawOutput.firstDate}

⚠️ Catatan:
- "dateStr" adalah nilai string ASLI dari flatpickr.
- Jika ini sudah salah (misal: "0002-01-03"), artinya flatpickr sendiri yang salah.
- Jika ini benar ("0002-01-05"), tapi tampilan input salah → masalah di value/state.`}
          </pre>
        </div>
      )}
    </div>
  );
}
