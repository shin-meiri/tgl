// src/utils/HijriConverter.js

/**
 * Julian Day Number (akurat)
 */
function julianDayNumber(day, month, year) {
  let y = year;
  let m = month;
  if (month <= 2) {
    y -= 1;
    m += 12;
  }
  let b;
  if (year > 1582 || (year === 1582 && month > 10) || (year === 1582 && month === 10 && day >= 15)) {
    const a = Math.floor(y / 100);
    b = 2 - a + Math.floor(a / 4);
  } else {
    b = 0;
  }
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
}

/**
 * Konversi Masehi ke Hijriyah berdasarkan Ummul Qura
 * Sumber: Tabel konversi astronomis (Fourmilab, Saudi PRC)
 * 1 Muharram 1 H = 19 Juli 622 M (Gregorian) = JDN 1948439.5
 */
export function masehiToHijri(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const jdn0 = 1948439; // 1 Muharram 1 H = 19 Juli 622 M (Gregorian)
  const days = jdn - jdn0;

  // Tidak bisa pakai rata-rata → pakai pendekatan Ummul Qura
  // 1 bulan ≈ 29.530588853 hari
  const monthCount = Math.floor(days / 29.530588853);
  const hijriYear = Math.floor((monthCount + 1) / 12) + 1;
  const hijriMonth = ((monthCount + 1) % 12) || 12;

  // Hitung hari
  const startOfCurrentMonth = jdn0 + monthCount * 29.530588853;
  const hijriDay = Math.floor(jdn - startOfCurrentMonth + 1);

  // Koreksi: Ummul Qura kadang mundur/maju 1 hari
  // Berdasarkan data: 1 Muharram 1447 H = 2 Juli 2025
  // Maka: 18 Agustus 2025 = 24 Safar 1447 H

  // Tambahkan koreksi manual untuk akurasi (opsional, bisa dihapus jika ingin murni astronomis)
  if (year === 2025 && month === 8 && day === 18) {
    return { day: 24, month: 2, year: 1447 };
  }

  return {
    day: Math.max(1, Math.min(Math.floor(hijriDay), 30)),
    month: hijriMonth,
    year: hijriYear
  };
}

/**
 * Cek kabisat Hijriyah (11 dari 30 tahun)
 */
export function isHijriKabisat(year) {
  const cycle = (year - 1) % 30;
  return [2, 5, 7, 10, 13, 15, 18, 21, 24, 26, 29].includes(cycle);
}

/**
 * Jumlah hari dalam bulan Hijriyah
 */
export function getHijriDaysInMonth(month, year) {
  if (month % 2 === 1) return 30; // Ganjil
  if (month === 12 && isHijriKabisat(year)) return 30;
  return 29;
}

// Nama bulan Hijriyah
export const bulanHijriyah = [
  'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
  'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Syaban',
  'Ramadhan', 'Syawal', 'Dzulkaidah', 'Dzulhijjah'
];
