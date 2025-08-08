// src/Weton.jsx
import React, { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import axios from 'axios';

const Weton = () => {
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // string: '2025-04-05'
  });
  const [wetonData, setWetonData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil data weton dari backend
  const fetchWeton = async (dateStr) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-weton.php`, {
        params: { date: dateStr },
      });
      setWetonData(response.data);
    } catch (error) {
      setWetonData({ error: 'Data tidak ditemukan atau server bermasalah.' });
    } finally {
      setLoading(false);
    }
  };

  // Inisialisasi flatpickr — hanya sekali saat komponen mount
  useEffect(() => {
    const fp = flatpickr(datePickerRef.current, {
      defaultDate: selectedDate,
      dateFormat: 'Y-m-d',
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          const dateStr = selectedDates[0].toISOString().split('T')[0];
          setSelectedDate(dateStr); // update sebagai string
        }
      },
    });

    return () => fp.destroy();
  }, []); // ✅ Tidak perlu dependency — hanya jalan sekali

  // Fetch data saat selectedDate berubah
  useEffect(() => {
    fetchWeton(selectedDate);
  }, [selectedDate]); // ✅ selectedDate adalah string → stabil dan valid

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔮 Cek Weton Jawa</h2>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="datepicker">Pilih Tanggal: </label>
        <input
          id="datepicker"
          ref={datePickerRef}
          type="text"
          placeholder="Pilih tanggal"
          style={{
            padding: '8px 12px',
            marginLeft: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>

      {loading && <p style={{ color: '#007BFF' }}>Memuat data...</p>}

      {wetonData && !wetonData.error && (
        <div
          style={{
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            marginBottom: '20px',
          }}
        >
          <h3>📅 Hasil Weton</h3>
          <p><strong>Tanggal:</strong> {wetonData.date_gregorian}</p>
          <p><strong>Weton:</strong> <strong>{wetonData.day_name} {wetonData.pasaran}</strong></p>
          <p><strong>Neptu:</strong> {wetonData.neptu}</p>
          <p><strong>Windu:</strong> {wetonData.windu}</p>
          <p><strong>Arah Keberuntungan:</strong> {wetonData.arah_mata_angin || 'Tidak tersedia'}</p>
        </div>
      )}

      {wetonData?.error && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>{wetonData.error}</p>
      )}

      {/* Deskripsi Weton */}
      <div style={{ lineHeight: '1.6', color: '#333' }}>
        <h3>📖 Apa Itu Weton?</h3>
        <p>
          Weton adalah hari kelahiran menurut kalender Jawa, gabungan dari <strong>7 hari</strong> 
          (Senin-Minggu) dan <strong>5 pasaran</strong> (Legi, Pahing, Pon, Wage, Kliwon). 
          Setiap kombinasi memiliki <strong>neptu</strong> yang digunakan untuk ramalan jodoh, 
          hari baik, dan kepribadian.
        </p>
        <p>
          <strong>Windu</strong> adalah siklus 8 tahun dalam kalender Jawa. 
          Sedangkan <strong>arah mata angin</strong> sering dikaitkan dengan keberuntungan berdasarkan pasaran.
        </p>
      </div>
    </div>
  );
};

export default Weton;
