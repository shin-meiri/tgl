import React, { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import axios from 'axios';

const Weton = () => {
  const datePickerRef = useRef(null);
  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // '2025-04-05'

  const [selectedDate, setSelectedDate] = useState(todayString); // Simpan sebagai string!
  const [wetonData, setWetonData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeton = async (dateStr) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost/backend/get-weton.php?date=${dateStr}`);
      setWetonData(res.data);
    } catch (err) {
      setWetonData({ error: 'Gagal terhubung ke server.' });
    } finally {
      setLoading(false);
    }
  };

  // Inisialisasi Flatpickr
  useEffect(() => {
    const fp = flatpickr(datePickerRef.current, {
      defaultDate: selectedDate,
      dateFormat: 'Y-m-d',
      onChange: (selectedDates) => {
        const date = selectedDates[0];
        if (date) {
          const dateString = date.toISOString().split('T')[0];
          setSelectedDate(dateString); // Simpan sebagai string
        }
      },
    });

    return () => fp.destroy();
  }, []);

  // Fetch data saat selectedDate berubah
  useEffect(() => {
    fetchWeton(selectedDate);
  }, [selectedDate]); // ✅ selectedDate sekarang string → stabil & aman

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>🔮 Cek Weton Jawa</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Pilih Tanggal: </label>
        <input
          ref={datePickerRef}
          type="text"
          style={{ padding: '8px', marginLeft: '10px' }}
        />
      </div>

      {loading && <p>Memuat data...</p>}

      {wetonData && !wetonData.error && (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h3>📅 Hasil Weton</h3>
          <p><strong>Tanggal:</strong> {wetonData.date_gregorian}</p>
          <p><strong>Weton:</strong> {wetonData.day_name} {wetonData.pasaran}</p>
          <p><strong>Neptu:</strong> {wetonData.neptu}</p>
          <p><strong>Windu:</strong> {wetonData.windu}</p>
          <p><strong>Arah:</strong> {wetonData.arah_mata_angin}</p>
        </div>
      )}

      {wetonData?.error && <p style={{ color: 'red' }}>{wetonData.error}</p>}

      <div style={{ marginTop: '30px', lineHeight: '1.6' }}>
        <h3>📖 Tentang Weton</h3>
        <p>
          Weton adalah hari kelahiran menurut kalender Jawa, gabungan dari 7 hari dan 5 pasaran. 
          Digunakan untuk ramalan, jodoh, dan hari baik.
        </p>
      </div>
    </div>
  );
};

export default Weton;
