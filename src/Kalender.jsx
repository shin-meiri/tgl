import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Wajib untuk tampilan dasar

const Kalender = () => {
  const inputRef = useRef(null);
  const fpInstance = useRef(null);

  useEffect(() => {
    // Inisialisasi flatpickr
    fpInstance.current = flatpickr(inputRef.current, {
      dateFormat: "Y-m-d",
      defaultDate: "today",
      showMonths: 1, // Hanya 1 bulan
      animate: false, // Matikan animasi agar lebih ringan
      clickOpens: true, // Klik input buka kalender
      allowInput: false, // Harus pilih dari kalender

      // Custom setelah kalender muncul
      onOpen: () => {
        const calendar = fpInstance.current;
        const daysContainer = calendar.days;
        const weekdayElements = daysContainer.parentNode?.querySelectorAll(
          ".flatpickr-weekday"
        );

        // Ganti nama hari ke Bahasa Indonesia: Min - Sab
        const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
        if (weekdayElements.length === 7) {
          weekdayElements.forEach((el, i) => {
            el.textContent = dayNames[i];
          });
        }
      },

      // Saat tanggal dipilih
      onChange: (selectedDates, dateStr) => {
        console.log("Tanggal dipilih:", dateStr);
        // Bisa kirim ke state, props.onSelect, dll
      },
    });

    return () => {
      if (fpInstance.current) {
        fpInstance.current.destroy();
      }
    };
  }, []);

  // Inline style minimal (mirip Excel: bersih, font kecil, kotak rapi)
  const inputStyle = {
    padding: "8px 12px",
    fontSize: "14px",
    border: "1px solid #aaa",
    borderRadius: "4px",
    width: "200px",
    fontFamily: "Consolas, Monaco, monospace", // Mirip Excel
    backgroundColor: "#fff",
    boxShadow: "1px 1px 3px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  };

  const containerStyle = {
    display: "inline-block",
    margin: "10px",
  };

  return (
    <div style={containerStyle}>
      {/* Input dengan ikon kalender */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Pilih tanggal..."
        style={inputStyle}
        readOnly
      />
    </div>
  );
};

export default Kalender;
