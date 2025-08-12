import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Tetap butuh CSS dasar flatpickr

const Kalender = () => {
  const inputRef = useRef(null);
  const flatpickrInstance = useRef(null);

  useEffect(() => {
    // Konfigurasi flatpickr
    flatpickrInstance.current = flatpickr(inputRef.current, {
      dateFormat: "Y-m-d",
      defaultDate: "today",
      inline: true, // Tampilkan langsung di bawah input, bukan popup
      onChange: (selectedDates, dateStr) => {
        console.log("Tanggal dipilih:", dateStr);
      },
      onReady: (selectedDates, dateStr, instance) => {
        // Customisasi tampilan setelah flatpickr siap
        customizeCalendar(instance);
      },
    });

    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
  }, []);

  const customizeCalendar = (fp) => {
    const calendarContainer = fp.calendarContainer;

    // Tambahkan header nama hari manual (opsional, karena fp sudah punya)
    // Tapi kita pastikan urutannya: Minggu - Sabtu
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const weekdaysElement = calendarContainer.querySelector(".flatpickr-weekdays .flatpickr-weekday");
    if (weekdaysElement && !weekdaysElement.customized) {
      const weekdaysContainer = calendarContainer.querySelector(".flatpickr-weekdays .weekdays");
      weekdaysContainer.innerHTML = "";

      dayNames.forEach(day => {
        const span = document.createElement("span");
        span.className = "flatpickr-weekday";
        span.innerHTML = day.slice(0, 3); // "Min", "Sen", dst.
        weekdaysContainer.appendChild(span);
      });
      weekdaysElement.customized = true;
    }
  };

  // Inline styles minimal
  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    display: "inline-block",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  };

  const inputStyle = {
    padding: "8px 12px",
    fontSize: "14px",
    border: "1px solid #aaa",
    borderRadius: "4px",
    width: "200px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <label htmlFor="kalender-input">Pilih Tanggal:</label>
      </div>
      <input
        id="kalender-input"
        ref={inputRef}
        type="text"
        placeholder="Klik untuk buka kalender"
        style={inputStyle}
        readOnly
      />
    </div>
  );
};

export default Kalender;
