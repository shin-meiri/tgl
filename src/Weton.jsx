import React, { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import axios from 'axios';

const Weton = () => {
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [wetonData, setWetonData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Format tanggal ke 'YYYY-MM-DD'
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
      setWetonData({ error: 'Gagal menghubungi server. Periksa koneksi backend.' });
    } finally {
      setLoading(false);
    }
  };

  // Inisialisasi Flatpickr dan fetch data awal
  useEffect(() => {
    // Inisialisasi flatpickr
    const fp = flatpickr(datePickerRef.current, {
      defaultDate: selectedDate,
      dateFormat: 'Y-m-d',
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          setSelectedDate(selectedDates[0]); // Ini akan trigger useEffect di bawah
        }
      },
    });

    // Cleanup pada unmount
    return () => {
      if (fp) fp.destroy();
    };
  }, []); // Hanya dijalankan sekali saat mount

  // Fetch data saat selectedDate berubah
  useEffect(() => {
    fetchWeton(formatDate(selectedDate));
  }, [selectedDate]); // ✅ Dependency: selectedDate

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h2>🔮 Cek Weton Jawa</h2>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="datepicker">Pilih Tanggal: </label>
        <input
          id="datepicker"
          ref={datePickerRef}
          type="text"
          placeholder="Pilih tanggal lahir"
          style={{
            padding: '8px 12px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginLeft: '10px',
          }}
        />
      </div>

      {loading && <p style={{ color: '#007BFF' }}>Memuat data weton...</p>}

      {wetonData && !wetonData.error && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h3>📅 Hasil Weton</h3>
          <p><strong>Tanggal Masehi:</strong> {wetonData.date_gregorian}</p>
          <p><strong>Weton:</strong> <strong>{wetonData.day_name} {wetonData.pasaran}</strong></p>
          <p><strong>Neptu:</strong> {wetonData.neptu}</p>
          <p><strong>Tanggal Jawa:</strong> {wetonData.tanggal_jawa} {wetonData.bulan_jawa} {wetonData.tahun_jawa}</p>
          <p><strong>Wuku:</strong> {wetonData.wuku}</p>
          <p><strong>Windu:</strong> {wetonData.windu}</p>
          <p><strong>Arah Keberuntungan:</strong> {wetonData.arah_mata_angin || 'Umum'}</p>
        </div>
      )}

      {wetonData?.error && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>{wetonData.error}</p>
      )}

      {/* Deskripsi Edukatif */}
      <div style={{ marginTop: '30px', lineHeight: '1.8', fontSize: '15px', color: '#333' }}>
        <h3>📖 Apa Itu Weton?</h3>
        <p>
          <strong>Weton</strong> adalah hari kelahiran menurut kalender tradisional Jawa, yang menggabungkan 
          <strong> 7 hari (Senin-Minggu)</strong> dan <strong>5 pasaran (Legi, Pahing, Pon, Wage, Kliwon)</strong>. 
          Kombinasi keduanya membentuk siklus 35 hari yang disebut <em>wetonan</em>.
        </p>
        <p>
          Setiap weton memiliki <strong>neptu</strong> (nilai angka), yang digunakan untuk menilai kepribadian, 
          ramalan jodoh (<em>rukun weton</em>), dan memilih hari baik seperti pernikahan atau khitanan.
        </p>
        <p>
          <strong>Windu</strong> adalah siklus 8 tahun dalam kalender Jawa (misal: Sancaya, Purwana). 
          Sedangkan <strong>arah mata angin</strong> sering dikaitkan dengan keberuntungan berdasarkan pasaran:
          <ul>
            <li><strong>Legi</strong> → Barat</li>
            <li><strong>Pahing</strong> → Timur</li>
            <li><strong>Pon</strong> → Selatan</li>
            <li><strong>Wage</strong> → Utara</li>
            <li><strong>Kliwon</strong> → Tengah</li>
          </ul>
        </p>
        <p>
          Contoh: <strong>Jumat Kliwon</strong> dianggap hari keramat dan sering digunakan untuk tirakat. 
          Sementara <strong>Rabu Pon</strong> dikenal sebagai weton pekerja keras dan ambisius.
        </p>
      </div>
    </div>
  );
};

export default Weton;
