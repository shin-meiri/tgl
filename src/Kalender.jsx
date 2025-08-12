// DateRangeTest.js
import React, { useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const DateRangeTest = () => {
  const [range1, setRange1] = useState(""); // untuk dropdown
  const [range2, setRange2] = useState(""); // untuk inline
  const [duration1, setDuration1] = useState(0);
  const [duration2, setDuration2] = useState(0);

  const inlinePicker = useRef(null);

  // Fungsi hitung durasi dalam hari
  const calculateDuration = (dates) => {
    if (dates.length < 2) return 0;
    const [start, end] = dates;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // hari
  };

  // Handler untuk dropdown
  const handleDropdownChange = (selectedDates, dateStr, instance) => {
    setRange1(dateStr);
    setDuration1(calculateDuration(selectedDates));
  };

  // Handler untuk inline
  const handleInlineChange = (selectedDates, dateStr, instance) => {
    setRange2(dateStr);
    setDuration2(calculateDuration(selectedDates));
  };

  // Konfigurasi umum
  const commonConfig = {
    mode: "range",
    dateFormat: "d-m-Y",
    onChange: () => {}, // akan di-override
    minDate: "today",
    maxDate: new Date().getFullYear() + 1 + "-12-31", // sampai th+1
    locale: {
      firstDayOfWeek: 1,
    },
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>🔧 Uji Flatpickr: Dropdown vs Inline (Rentang Tanggal)</h2>

      <div style={{ marginBottom: "40px" }}>
        <h3>📅 1. Dropdown (Input)</h3>
        <Flatpickr
          options={{
            ...commonConfig,
            onChange: handleDropdownChange,
          }}
          value={range1}
          onChange={handleDropdownChange}
          placeholder="Pilih rentang tanggal..."
          style={{ padding: "8px", fontSize: "16px" }}
        />
        <div style={{ marginTop: "10px" }}>
          <strong>Rentang:</strong> {range1 || "Belum dipilih"}
          <br />
          <strong>Durasi:</strong> {duration1} hari
        </div>
      </div>

      <div>
        <h3>🗓️ 2. Inline (Kalender Tetap Tampil)</h3>
        <Flatpickr
          ref={inlinePicker}
          options={{
            ...commonConfig,
            inline: true,
            onChange: handleInlineChange,
          }}
          value={range2}
          onChange={handleInlineChange}
        />
        <div style={{ marginTop: "10px" }}>
          <strong>Rentang:</strong> {range2 || "Belum dipilih"}
          <br />
          <strong>Durasi:</strong> {duration2} hari
        </div>
      </div>

      <hr />
      <p>
        <small>
          <strong>Catatan:</strong> Pilih dua tanggal untuk membentuk rentang.
          Kalender mendukung sampai tahun berikutnya (misal: 2025 jika sekarang 2024).
        </small>
      </p>
    </div>
  );
};

export default DateRangeTest;
