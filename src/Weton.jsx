// Weton.jsx
import React, { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// --- Konstanta Weton ---
const EPOCH = new Date(1899, 11, 31); // 1 Jan 1900 = Legi
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const NEPTU_HARI = { Min: 5, Sen: 4, Sel: 3, Rab: 7, Kam: 8, Jum: 6, Sab: 9 };
const NEPTU_PASARAN = { Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8 };
const ARAH_WETON = {
  Legi: 'Timur',
  Pahing: 'Selatan',
  Pon: 'Barat',
  Wage: 'Utara',
  Kliwon: 'Pusat'
};

// --- Fungsi Bantuan ---
const getWeton = (date) => {
  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const diff = Math.floor((date - EPOCH) / MS_PER_DAY);
  return pasaran[diff % 5];
};

const getDayName = (date) => {
  const names = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  return names[date.getDay()];
};

// --- KOMPONEN UTAMA ---
const Weton = () => {
  const [wetonInfo, setWetonInfo] = useState(null);
  const flatpickrRef = useRef(null);

  const hitungWeton = (date) => {
    // Pergantian weton jam 18:00
    const isAfterSunset = date.getHours() >= 18;
    const baseDate = new Date(date);
    if (isAfterSunset) baseDate.setDate(baseDate.getDate() + 1);

    const hari = getDayName(baseDate);
    const weton = getWeton(baseDate);
    const neptuHari = NEPTU_HARI[hari];
    const neptuWeton = NEPTU_PASARAN[weton];
    const arah = ARAH_WETON[weton];
    const totalNeptu = neptuHari + neptuWeton;

    const formattedDate = baseDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    setWetonInfo({
      tanggal: formattedDate,
      hari,
      weton,
      neptuHari,
      neptuWeton,
      arah,
      totalNeptu,
      isAfterSunset
    });
  };

  useEffect(() => {
    if (flatpickrRef.current) {
      const fp = flatpickr(flatpickrRef.current, {
        inline: true,
        defaultDate: new Date(),
        locale: {
          firstDayOfWeek: 1,
          weekdays: {
            shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
            longhand: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
          },
          months: {
            shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
            longhand: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
          }
        },
        onChange: (dates) => {
          if (dates.length > 0) hitungWeton(dates[0]);
        }
      });

      // Hitung weton hari ini
      hitungWeton(new Date());

      return () => fp.destroy();
    }
  }, []);

  // Jika belum ada data, jangan stuck
  if (!wetonInfo) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Memuat kalender...</div>;
  }

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h3>🧭 Weton & Arah Spiritual</h3>

      {/* Flatpickr Inline - TAMPIL LANGSUNG */}
      <div ref={flatpickrRef} style={{ marginBottom: '20px' }}></div>

      {/* Informasi Weton */}
      <div className="weton-result" style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', fontSize: '0.95rem' }}>
        <h4>📅 Informasi Weton</h4>
        <p><strong>Tanggal:</strong> {wetonInfo.tanggal}</p>
        <p><strong>Hari:</strong> {wetonInfo.hari} ({wetonInfo.neptuHari})</p>
        <p><strong>Weton:</strong> {wetonInfo.weton} ({wetonInfo.neptuWeton})</p>
        <p><strong>Arah Ke:</strong> <span style={{ fontWeight: 'bold', color: '#d32f2f' }}>{wetonInfo.arah}</span></p>
        <p><strong>Neptu Total:</strong> {wetonInfo.totalNeptu}</p>
        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>
          <em>{wetonInfo.isAfterSunset ? 'Weton sudah berganti (setelah 18:00)' : 'Masih weton hari ini'}</em>
        </p>
      </div>

      {/* Diagram Mata Angin */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gridTemplateRows: '1fr auto 1fr',
        gap: '8px',
        maxWidth: '300px',
        margin: '25px auto',
        textAlign: 'center',
        fontSize: '0.9rem'
      }}>
        <div style={{
          backgroundColor: wetonInfo.weton === 'Wage' ? '#e3f2fd' : '#f1f3f5',
          padding: '10px',
          borderRadius: '8px',
          fontWeight: wetonInfo.weton === 'Wage' ? 'bold' : 'normal'
        }}>
          Utara<br/><small>Wage</small>
          {wetonInfo.weton === 'Wage' && <span style={{ display: 'block', marginTop: '4px', fontSize: '1.2rem' }}>↑</span>}
        </div>

        <div></div>
        <div></div>

        <div style={{
          backgroundColor: wetonInfo.weton === 'Pon' ? '#e3f2fd' : '#f1f3f5',
          padding: '10px',
          borderRadius: '8px',
          fontWeight: wetonInfo.weton === 'Pon' ? 'bold' : 'normal'
        }}>
          Barat<br/><small>Pon</small>
          {wetonInfo.weton === 'Pon' && <span style={{ display: 'block', marginTop: '4px', fontSize: '1.2rem' }}>←</span>}
        </div>

        <div style={{
          backgroundColor: wetonInfo.weton === 'Kliwon' ? '#f3e5f5' : '#f9f9f9',
          padding: '10px',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          Pusat<br/><small>Kliwon</small>
          {wetonInfo.weton === 'Kliwon' && <span style={{ display: 'block', fontSize: '1.4rem', color: '#9c27b0' }}>•</span>}
        </div>

        <div style={{
          backgroundColor: wetonInfo.weton === 'Legi' ? '#e3f2fd' : '#f1f3f5',
          padding: '10px',
          borderRadius: '8px',
          fontWeight: wetonInfo.weton === 'Legi' ? 'bold' : 'normal'
        }}>
          Timur<br/><small>Legi</small>
          {wetonInfo.weton === 'Legi' && <span style={{ display: 'block', marginTop: '4px', fontSize: '1.2rem' }}>→</span>}
        </div>

        <div></div>

        <div style={{
          backgroundColor: wetonInfo.weton === 'Pahing' ? '#e3f2fd' : '#f1f3f5',
          padding: '10px',
          borderRadius: '8px',
          fontWeight: wetonInfo.weton === 'Pahing' ? 'bold' : 'normal'
        }}>
          Selatan<br/><small>Pahing</small>
          {wetonInfo.weton === 'Pahing' && <span style={{ display: 'block', marginTop: '4px', fontSize: '1.2rem' }}>↓</span>}
        </div>

        <div></div>
      </div>
    </div>
  );
};

export default Weton;
