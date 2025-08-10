// components/Kalender.jsx
import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const Kalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [kalenderBulanan, setKalenderBulanan] = useState([]);

  const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const pasaran = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const neptuPasaran = { Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8 };
  const neptuHari = {
    Minggu: 5,
    Senin: 4,
    Selasa: 3,
    Rabu: 7,
    Kamis: 8,
    Jumat: 6,
    Sabtu: 9,
  };

  // ✅ Pindahkan ke luar useEffect agar bisa dimasukkan ke dependency
  const hitungPasaran = (date) => {
    const epoch = new Date('1970-01-01');
    const diff = (date - epoch) / (1000 * 60 * 60 * 24);
    const index = Math.floor(diff) % 5;
    return pasaran[index < 0 ? index + 5 : index];
  };

  // ✅ Fungsi dibuat stabil agar bisa dimasukkan ke dependency
  const buatKalenderBulanan = React.useCallback((date) => {
    const tahun = date.getFullYear();
    const bulan = date.getMonth();
    const pertama = new Date(tahun, bulan, 1);
    const terakhir = new Date(tahun, bulan + 1, 0);
    const totalHari = terakhir.getDate();
    const hariPertama = pertama.getDay();

    const mingguan = [];
    let minggu = Array(7).fill(null);

    for (let i = 0; i < hariPertama; i++) {
      minggu[i] = null;
    }

    for (let tanggal = 1; tanggal <= totalHari; tanggal++) {
      const tglObj = new Date(tahun, bulan, tanggal);
      const hari = namaHari[tglObj.getDay()];
      const pasar = hitungPasaran(tglObj);
      const neptuTotal = neptuHari[hari] + neptuPasaran[passar];

      const hariKalender = {
        tanggal,
        hari,
        pasar,
        neptu: neptuTotal,
        date: tglObj,
      };

      minggu[tglObj.getDay()] = hariKalender;

      if (tglObj.getDay() === 6 || tanggal === totalHari) {
        mingguan.push([...minggu]);
        minggu = Array(7).fill(null);
      }
    }

    if (minggu.some(Boolean)) {
      mingguan.push(minggu);
    }

    setKalenderBulanan(mingguan);
  }, [namaHari, pasaran, neptuHari, neptuPasaran, hitungPasaran]); // ✅ Tambahkan dependency

  // ✅ Gunakan useCallback agar referensi tetap sama
  useEffect(() => {
    buatKalenderBulanan(selectedDate);
  }, [selectedDate, buatKalenderBulanan]); // ✅ Tambahkan buatKalenderBulanan sebagai dependency

  const handleChange = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  const formatBulanTahun = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // ❌ Komentari atau hapus axios jika belum dipakai
  // import axios from 'axios'; → JANGAN DI-IMPORT DI ATAS JIKA BELUM DIGUNAKAN

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Kalender Jawa</h2>
        <Flatpickr
          value={selectedDate}
          onChange={handleChange}
          options={{
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'd F Y',
            allowInput: false,
            clickOpens: true,
            monthSelectorType: 'dropdown',
            yearSelectorType: 'dropdown',
            showMonths: 1,
            static: false,
            locale: {
              firstDayOfWeek: 1,
              weekdays: {
                shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                longhand: namaHari,
              },
              months: {
                shorthand: [
                  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
                ],
                longhand: [
                  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
                ],
              },
            },
          }}
          className="p-3 text-lg border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-center cursor-pointer"
          placeholder="Pilih bulan..."
        />
      </div>

      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">
          {formatBulanTahun(selectedDate)}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              {namaHari.map((hari) => (
                <th key={hari} className="border border-gray-300 p-3 font-bold text-gray-800">
                  {hari}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kalenderBulanan.map((minggu, i) => (
              <tr key={i}>
                {minggu.map((hari, idx) => (
                  <td
                    key={idx}
                    className={`border border-gray-300 p-2 text-center min-h-16 relative ${
                      hari ? 'hover:bg-blue-50 transition' : 'bg-gray-50'
                    }`}
                  >
                    {hari ? (
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">{hari.tanggal}</div>
                        <div className="text-xs text-green-600 font-medium">{hari.pasar}</div>
                        <div className="text-xs text-gray-500">N: {hari.neptu}</div>
                      </div>
                    ) : (
                      <div className="text-gray-300">—</div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        Kalender menampilkan tanggal internasional, pasaran, dan neptu harian.
      </div>
    </div>
  );
};

export default Kalender;
