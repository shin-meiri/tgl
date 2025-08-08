// Weton.jsx
import React, { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// --- Konstanta Weton ---
const EPOCH = new Date(1899, 11, 31); // 31 Des 1899 → 1 Jan 1900 = Legi
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

  // Hitung weton
  const hitungWeton = (date) => {
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
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    setWetonInfo({
      tanggal: formattedDate,
      hari, weton, neptuHari, neptuWeton, arah, totalNeptu, isAfterSunset
    });
  };

  // Inisialisasi flatpickr
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
        onChange: (dates) => dates[0] && hitungWeton(dates[0])
      });

      // Hitung langsung
      hitungWeton(new Date());

      return () => fp.destroy();
    }
  }, []);

  // Jangan pakai axios untuk CSS — karena kamu bilang Kalender jalan, Weton harus jalan tanpa ketergantungan
  // Kita langsung lanjutkan meski CSS dari MySQL tidak dimuat
  useEffect(() => {
    // Coba muat CSS dari MySQL, TAPI jangan tahan render
    fetch('/api/theme.php')
      .then(res => res.json())
      .then(data => {
        let style = document.getElementById('dynamic-css-weton');
        if (!style) {
          style = document.createElement('style');
          style.id = 'dynamic-css-weton';
          document.head.appendChild(style);
        }
        style.textContent = data.css || '';
      })
      .catch(err => {
        console.warn('Gagal muat CSS dari MySQL, lanjutkan tanpa CSS', err);
      })
      .finally(() => {
        // 🔥 INI YANG SANGAT PENTING: JANGAN TUNGGU CSS!
        // Kalau CSS gagal, tetap tampilkan komponen!
        if (!wetonInfo) {
          hitungWeton(new Date()); // Pastikan wetonInfo terisi
        }
      });
  }, [wetonInfo]);

  // Jika belum ada data, isi default
  if (!wetonInfo) {
    return <div className="loading">Memuat...</div>;
  }

  return (
    <div className="weton-container">
      <h3>🧭 Weton & Arah Spiritual</h3>

      {/* Flatpickr Inline */}
      <div ref={flatpickrRef} className="flatpickr-inline"></div>

      {/* Hasil */}
      <div className="weton-result">
        <h4>📅 Hasil Weton</h4>
        <p><strong>Tanggal:</strong> {wetonInfo.tanggal}</p>
        <p><strong>Hari:</strong> {wetonInfo.hari} ({wetonInfo.neptuHari})</p>
        <p><strong>Weton:</strong> {wetonInfo.weton} ({wetonInfo.neptuWeton})</p>
        <p><strong>Arah Ke:</strong> <span style={{ fontWeight: 'bold', color: '#d32f2f' }}>{wetonInfo.arah}</span></p>
        <p><strong>Neptu Total:</strong> {wetonInfo.totalNeptu}</p>
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
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
        margin: '20px auto',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: wetonInfo.weton === 'Wage' ? '#e3f2fd' : '#f1f3f5',
          padding: '10px',
          borderRadius: '8px',
          fontWeight: wetonInfo.weton === 'Wage' ? 'bold' : 'normal'
        }}>
          Utara<br/><small>Wage</small>
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
        </div>

        <div style={{
          backgroundColor: wetonInfo.weton === 'Kliwon' ? '#bbdefb' : '#f3e5f5',
          padding: '10px',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          Pusat<br/><small>Kliwon</small>
        </div>

        <div style={{
          backgroundColor: wetonInfo.weton === 'Legi' ? '#e3f2fd' : '#f1f3f5',
          padding: '10px',
          borderRadius: '8px',
          fontWeight: wetonInfo.weton === 'Legi' ? 'bold' : 'normal'
        }}>
          Timur<br/><small>Legi</small>
        </div>

        <div></div>
        <div style={{
          backgroundColor: wetonInfo.weton === 'Pahing' ? '#e3f2fd' : '#f1f3f5',
          padding: '10px',
          borderRadius: '8px',
          fontWeight: wetonInfo.weton === 'Pahing' ? 'bold' : 'normal'
        }}>
          Selatan<br/><small>Pahing</small>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Weton;
