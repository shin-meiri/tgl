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

// 🔧 TITIK ACUAN: 1 Muharram 1447 H = 26 Juli 2025 M
// JDN 2460882 = 26 Juli 2025
// JDN 1948439 = 16 Juli 622
// Kita pakai acuan modern: 1 Muharram 1447 H = 26 Juli 2025
const HIJRI_EPOCH_JDN = julianDayNumber(26, 7, 2025) - (1447 - 1) * 354.36709 - 29.530588853 * 6; // Koreksi empiris

/**
 * Konversi Masehi ke Hijriyah (dengan koreksi akurat)
 */
export function masehiToHijri(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const daysSinceEpoch = jdn - HIJRI_EPOCH_JDN;

  // Panjang rata-rata bulan Hijriyah
  const monthCount = Math.floor(daysSinceEpoch / 29.530588853);
  const hijriYear = Math.floor((monthCount + 1) / 12) + 1;
  const hijriMonth = ((monthCount + 1) % 12) || 12;

  // Hitung hari
  const startOfCurrentMonth = HIJRI_EPOCH_JDN + monthCount * 29.530588853;
  const hijriDay = Math.floor(jdn - startOfCurrentMonth + 1);

  return {
    day: Math.max(1, Math.min(Math.ceil(hijriDay), 30)),
    month: hijriMonth,
    year: hijriYear
  };
}

/**
 * Cek tahun kabisat Hijriyah
 */
export function isHijriKabisat(year) {
  const cycle = (year - 1) % 30;
  return [2, 5, 7, 10, 13, 15, 18, 21, 24, 26, 29].includes(cycle);
}

/**
 * Jumlah hari dalam bulan Hijriyah
 */
export function getHijriDaysInMonth(month, year) {
  if (month % 2 === 1) return 30;
  if (month === 12 && isHijriKabisat(year)) return 30;
  return 29;
}

export const bulanHijriyah = [
  'Muharram',
  'Safar',
  'Rabiul Awal',
  'Rabiul Akhir',
  'Jumadil Awal',
  'Jumadil Akhir',
  'Rajab',
  'Syaban',
  'Ramadhan',
  'Syawal',
  'Dzulkaidah',
  'Dzulhijjah'
];
