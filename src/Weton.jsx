import React, { useState, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import axios from 'axios';

const Weton = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [wetonData, setWetonData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Format tanggal untuk API (YYYY-MM-DD)
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Ambil data weton dari backend
  const fetchWeton = async (dateStr) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost/backend/get-weton.php?date=${dateStr}`);
      setWetonData(res.data);
    } catch (err) {
      setWetonData({ error: 'Gagal mengambil data dari server.' });
    } finally {
      setLoading(false);
    }
  };

  // Inisialisasi Flatpickr
  useEffect(() => {
    const fp = flatpickr('#datepicker', {
      defaultDate: selectedDate,
      dateFormat: 'Y-m-d',
      onChange: (selectedDates) => {
        const date = selectedDates[0];
        setSelectedDate(date);
        fetchWeton(formatDate(date));
      },
    });

    // Fetch data saat pertama kali load (hari ini)
    fetchWeton(formatDate(selectedDate));

    return () => fp.destroy();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>🔮 Cek Weton Jawa</h2>

      <div>
        <label htmlFor="datepicker">Pilih Tanggal: </label>
        <input
          id="datepicker"
          type="text"
          placeholder="Pilih tanggal"
          style={{ padding: '8px', fontSize: '16px' }}
        />
      </div>

      {loading && <p>Memuat data weton...</p>}

      {wetonData && !wetonData.error && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h3>📅 Hasil Weton</h3>
          <p><strong>Tanggal:</strong> {wetonData.date_gregorian}</p>
          <p><strong>Weton:</strong> {wetonData.day_name} {wetonData.pasaran}</p>
          <p><strong>Neptu:</strong> {wetonData.neptu}</p>
          <p><strong>Tahun Jawa:</strong> {wetonData.tanggal_jawa} {wetonData.bulan_jawa} {wetonData.tahun_jawa}</p>
          <p><strong>Wuku:</strong> {wetonData.wuku}</p>
          <p><strong>Windu:</strong> {wetonData.windu}</p>
          <p><strong>Arah Keberuntungan:</strong> {wetonData.arah_mata_angin || 'Tidak tersedia'}</p>
        </div>
      )}

      {wetonData?.error && (
        <p style={{ color: 'red' }}>{wetonData.error}</p>
      )}

      {/* Deskripsi Umum Weton */}
      <div style={{ marginTop: '30px', lineHeight: '1.6' }}>
        <h3>📖 Apa itu Weton?</h3>
        <p>
          Weton adalah hari kelahiran menurut kalender Jawa, yang menggabungkan hari (Senin-Minggu) 
          dan pasaran (Legi, Pahing, Pon, Wage, Kliwon). Setiap kombinasi memiliki neptu (nilai simbolik) 
          yang digunakan untuk ramalan jodoh, hari baik, dan kepribadian.
        </p>
        <p>
          Dalam budaya Jawa, weton digunakan untuk menentukan perjodohan (rukun weton), memilih hari pernikahan, 
          hingga menilai watak seseorang. Windu dan wuku juga menjadi bagian dari sistem Pawukon 210 hari.
        </p>
        <p>
          <strong>Jumat Kliwon</strong> dianggap hari keramat, sering digunakan untuk meditasi atau ritual spiritual.
          Sementara <strong>Rabu Pon</strong> dikenal sebagai weton pekerja keras dan ambisius.
        </p>
      </div>
    </div>
  );
};

export default Weton;
