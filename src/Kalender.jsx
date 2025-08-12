import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const DateRangeTest = () => {
  const [range1, setRange1] = useState([]); // untuk dropdown
  const [range2, setRange2] = useState([]); // untuk inline
  const [duration1, setDuration1] = useState(0);
  const [duration2, setDuration2] = useState(0);

  // Fungsi hitung durasi (hari)
  const calculateDuration = (dates) => {
    if (dates.length < 2) return 0;
    const [start, end] = dates;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // hari
  };

  const handleDropdownChange = (dates) => {
    setRange1(dates);
    const days = calculateDuration(dates);
    setDuration1(days);
  };

  const handleInlineChange = (dates) => {
    setRange2(dates);
    const days = calculateDuration(dates);
    setDuration2(days);
  };

  const formatRange = (dates) => {
    if (dates.length === 0) return "Pilih rentang tanggal";
    if (dates.length === 1) return "Tunggu tanggal akhir...";
    const start = dates[0].toLocaleDateString();
    const end = dates[1].toLocaleDateString();
    return `${start} — ${end}`;
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h2>🔍 Uji Flatpickr: Dropdown vs Inline (Range >3 Hari)</h2>

      <hr />

      {/* === DROPDOWN (Mirip Excel) === */}
      <div style={{ marginBottom: "40px" }}>
        <h3>1. Dropdown (Input - Mirip Excel)</h3>
        <p>Pilih rentang tanggal (klik input → pilih awal & akhir)</p>

        <Flatpickr
          value={range1}
          onChange={handleDropdownChange}
          options={{
            mode: "range",
            dateFormat: "Y-m-d",
            allowInput: true,
            placeholder: "Pilih rentang tanggal...",
            onClose: (selectedDates) => {
              // Optional: logika tambahan saat popup ditutup
            },
          }}
          style={{
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <div style={{ marginTop: "10px" }}>
          <strong>Rentang:</strong> {formatRange(range1)} <br />
          <strong>Durasi:</strong> {duration1} hari
          {duration1 > 3 && (
            <span style={{ color: "green", marginLeft: "10px" }}>
              ✅ >3 hari terdeteksi dengan benar
            </span>
          )}
        </div>
      </div>

      <hr />

      {/* === INLINE MODE === */}
      <div style={{ marginBottom: "40px" }}>
        <h3>2. Inline Mode (Kalender Selalu Tampil)</h3>
        <p>Klik dua tanggal untuk membuat rentang</p>

        <div
          style={{
            display: "inline-block",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Flatpickr
            value={range2}
            onChange={handleInlineChange}
            options={{
              mode: "range",
              inline: true, // Wajib untuk inline
              dateFormat: "Y-m-d",
            }}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>Rentang:</strong> {formatRange(range2)} <br />
          <strong>Durasi:</strong> {duration2} hari
          {duration2 > 3 && (
            <span style={{ color: "green", marginLeft: "10px" }}>
              ✅ >3 hari terdeteksi dengan benar
            </span>
          )}
        </div>
      </div>

      {/* === INFO TAMBAHAN === */}
      <div style={{ marginTop: "40px", color: "#555", fontSize: "14px" }}>
        <h4>💡 Catatan:</h4>
        <ul>
          <li>
            Kedua mode menggunakan <code>mode: "range"</code> dan logika hitung yang sama.
          </li>
          <li>
            Durasi hanya dihitung saat <strong>dua tanggal terpilih</strong>.
          </li>
          <li>
            Jika hasilnya akurat (>3 hari terdeteksi), maka <strong>inline tidak bermasalah</strong>.
          </li>
          <li>
            Jika inline "tidak akurat", cek:
            <ul>
              <li>Apakah CSS memotong kalender?</li>
              <li>Apakah event <code>onChange</code> dipanggil prematur?</li>
              <li>Apakah <code>inline: true</code> benar-benar di-set?</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DateRangeTest;
