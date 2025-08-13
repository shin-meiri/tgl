// Kalender.jsx
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// Daftar bulan dalam bahasa Indonesia (opsional)
const bulanIndo = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Fungsi format: 1 Januari 622
const formatTampilan = (dateStr) => {
  if (!dateStr) return '';
  const [tahun, bulan, tanggal] = dateStr.split('-');
  const tgl = parseInt(tanggal, 10);
  const bln = bulanIndo[parseInt(bulan, 10) - 1];
  return `${tgl} ${bln} ${tahun}`;
};

export default function Kalender({ value, onChange, label = "Pilih Tanggal" }) {
  // value: string "YYYY-MM-DD"
  // onChange: callback dengan string

  const handleChange = (selectedDates, dateStr) => {
    // Gunakan string langsung dari flatpickr → aman dari timezone
    onChange(dateStr); // Kirim string ke parent
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
        {label}
      </label>

      <Flatpickr
        // Hanya gunakan string, tidak pakai Date object
        value={value || ''} // string: "1671-12-01"
        
        onChange={handleChange}
        
        options={{
          // Format penyimpanan (wajib YYYY-MM-DD agar aman)
          dateFormat: 'Y-m-d',

          // Format tampilan di input (opsional, bisa dibaca manusia)
          altFormat: 'F j, Y', // contoh: December 1, 1671

          // Izinkan klik atau ketik
          allowInput: true,
          clickOpens: true,

          // Tidak usah pakai UTC: kita hindari Date object
          // Cukup andalkan string
        }}

        className="form-control"
        placeholder="Pilih tanggal (misal: 10 Agustus 622)"
        style={{ padding: '8px', fontSize: '14px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
      />

      {/* Tampilkan nilai asli (untuk debugging atau konfirmasi) */}
      {value && (
        <p style={{ marginTop: '8px', color: '#2c5282', fontSize: '14px' }}>
          <strong>Dipilih:</strong> {formatTampilan(value)}
        </p>
      )}
    </div>
  );
      }
