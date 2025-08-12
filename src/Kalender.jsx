// App.js
import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

function App() {
  const [range1, setRange1] = useState(""); // untuk dropdown
  const [range2, setRange2] = useState(""); // untuk inline

  const handleRangeChange = (dates, setRange) => {
    if (dates.length === 2) {
      const start = dates[0];
      const end = dates[1];

      const timeDiff = end - start;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      const formatted = `${formatDate(start)} — ${formatDate(end)} (${daysDiff} hari)`;
      setRange(formatted);
    } else {
      setRange("Pilih tanggal akhir...");
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const commonOptions = {
    mode: "range",
    dateFormat: "Y-m-d",
    onChange: (dates) => {
      // Kita handle manual, bukan simpan array langsung
    },
    onReady: (selectedDates, dateStr, instance) => {
      // Trigger onChange sekali saat siap
      if (selectedDates.length === 2) {
        handleRangeChange(selectedDates, instance.element === document.getElementById("inline") ? setRange2 : setRange1);
      }
    },
    onChange: (selectedDates, dateStr, instance) => {
      // Cek elemen mana yang memanggil
      if (selectedDates.length === 2) {
        if (instance.element.id === "inline") {
          handleRangeRange(selectedDates, setRange2);
        } else {
          handleRangeChange(selectedDates, setRange1);
        }
      } else {
        // Jika belum lengkap
        const setter = instance.element.id === "inline" ? setRange2 : setRange1;
        setter("Rentang belum lengkap...");
      }
    },
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h2>🎯 Uji Flatpickr: Dropdown vs Inline (Range >3 Hari)</h2>

      <div style={{ marginBottom: "30px" }}>
        <h3>📅 1. Dropdown (Input Click)</h3>
        <Flatpickr
          id="dropdown"
          options={commonOptions}
          placeholder="Pilih rentang tanggal..."
          style={{ padding: "8px", fontSize: "16px" }}
        />
        <div style={{ marginTop: "10px", color: "#2c3e50", fontWeight: "bold" }}>
          Hasil: {range1 || "Belum memilih"}
        </div>
      </div>

      <div>
        <h3>🗓️ 2. Inline (Kalender Selalu Tampil)</h3>
        <div id="inline-container" style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", backgroundColor: "#f9f9f9" }}>
          <Flatpickr
            id="inline"
            options={{
              ...commonOptions,
              inline: true,
            }}
          />
        </div>
        <div style={{ marginTop: "10px", color: "#2c3e50", fontWeight: "bold" }}>
          Hasil: {range2 || "Belum memilih"}
        </div>
      </div>

      <div style={{ marginTop: "30px", color: "#7f8c8d", fontSize: "14px" }}>
        <p>💡 <strong>Instruksi:</strong> Pilih rentang lebih dari 3 hari (misal: 1 Jan 2025 → 15 Mar 2026) dan lihat apakah keduanya menunjukkan jumlah hari yang sama.</p>
        <p>🔧 Jika hasilnya berbeda, berarti ada masalah di event handling atau UI.</p>
      </div>
    </div>
  );
}

export default App;
