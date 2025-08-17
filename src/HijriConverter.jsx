// src/utils/HijriConverter.js

// Julian Day Number (dari sebelumnya)
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

// Konversi Julian Day ke Hijriyah
export function jdToHijri(jd) {
  const jd0 = jd - 1721425.5;
  const cycle = Math.floor(jd0 / 10631);
  const jd1 = jd0 - 10631 * cycle;
  const jd2 = Math.floor(jd1 / 10631 * 30) + 1;
  const jd3 = jd1 - Math.floor((jd2 - 1) / 30 * 10631);
  const year = 30 * cycle + jd2;
  const month = Math.ceil((jd3 + 29.5) / 29.530588853);
  const day = jd3 - Math.floor((month - 1) * 29.530588853) + 1;

  return {
    day: Math.floor(day),
    month: Math.min(12, Math.floor(month)),
    year: Math.floor(year)
  };
}

// Konversi Masehi ke Hijriyah
export function masehiToHijri(day, month, year) {
  const jd = julianDayNumber(day, month, year);
  return jdToHijri(jd);
}

// Nama bulan Hijriyah
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
