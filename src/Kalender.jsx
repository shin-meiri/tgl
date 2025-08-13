// Kalender.jsx
import React from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default function Kalender() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h3>🎯 Tampilkan Hasil Datepicker: Apa Adanya</h3>
      <p><em>Pilih tanggal — lihat output langsung dari flatpickr.</em></p>

      <div style={{ marginBottom: '20px' }}>
        <Flatpickr
          options={{
            dateFormat: 'Y-m-d',        // Format output
            altFormat: 'F j, Y',        // Tampilan di picker
            allowInput: true,
            clickOpens: true,
          }}
          // 🔴 Tidak ada value
          // 🔴 Tidak ada useState
          // 🔴 Tidak ada perantara
          onChange={(selectedDates, dateStr) => {
            // 🔥 INI YANG KAMU MAU:
            // LANGSUNG TAMPILKAN, TANPA RUMUS
            console.log('📅 Apa adanya dari flatpickr:', dateStr);
            alert('Hasil asli: ' + dateStr); // Tampilkan langsung
          }}
          style={{
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #000',
            borderRadius: '6px',
            backgroundColor: '#fff',
          }}
        />
      </div>

      <div style={{ color: '#555', fontSize: '14px' }}>
        <p>📌 <strong>Instruksi:</strong></p>
        <ol>
          <li>Pilih tanggal (misal: 9 April 1478)</li>
          <li>Lihat <strong>alert</strong> atau <strong>console</strong></li>
          <li><strong>Itu dia hasil asli dari flatpickr — tanpa rumus, tanpa proses.</strong></li>
        </ol>
        <p>❌ Tidak ada <code>useState</code>, tidak ada <code>value</code>, tidak ada <code>setState</code>.</p>
        <p>✅ Hanya: <code>onChange</code> → langsung <code>alert</code> / <code>console.log</code>.</p>
      </div>
    </div>
  );
            }
