// src/utils/HijriConverter.js

/**
 * Julian Day Number
 */
export function julianDayNumber(day, month, year) {
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

// 🔧 TITIK ACUAN: 16 Juli 622 M = 1 Muharram 1 H
const HIJRI_EPOCH_JDN = 1948439; // Julian Day Number 16 Juli 622 (Julian)

/**
 * Konversi Masehi ke Hijriyah
 * Berdasarkan siklus 30 tahun (11 kabisat)
 */
export function masehiToHijri(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const daysSinceEpoch = jdn - HIJRI_EPOCH_JDN;

  // 1 tahun Hijriyah rata-rata = 354.36709 hari
  // 1 bulan = 29.53059 hari
  // Tapi kita pakai pendekatan siklus 30 tahun
  const totalMonths = Math.floor(daysSinceEpoch / 29.530588853);
  const hijriYear = Math.floor((totalMonths + 1) / 12) + 1;
  const hijriMonth = ((totalMonths + 1) % 12) || 12;

  // Hitung JDN awal bulan Hijriyah ini
  const monthOffset = totalMonths;
  const startOfHijriMonth = HIJRI_EPOCH_JDN + Math.round(monthOffset * 29.530588853);

  // Hitung hari
  const hijriDay = jdn - startOfHijriMonth + 1;

  return {
    day: Math.max(1, Math.min(Math.ceil(hijriDay), 30)),
    month: hijriMonth,
    year: hijriYear
  };
}

/**
 * Cek tahun kabisat Hijriyah (11 dari 30)
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
