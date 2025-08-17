// src/utils/HijriConverter.js
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

const HIJRI_EPOCH_JDN = julianDayNumber(16, 7, 622); // 1 Muharram 1 H

export function masehiToHijri(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const daysSinceEpoch = jdn - HIJRI_EPOCH_JDN;
  const monthCount = Math.floor(daysSinceEpoch / 29.530588853);
  const hijriYear = Math.floor((monthCount + 1) / 12) + 1;
  const hijriMonth = ((monthCount + 1) % 12) || 12;
  const calculatedDay = Math.floor(jdn - (HIJRI_EPOCH_JDN + monthCount * 29.530588853) + 1);
  const hijriDay = Math.max(1, Math.min(calculatedDay, 30));
  return { day: hijriDay, month: hijriMonth, year: hijriYear };
}

export function isHijriKabisat(year) {
  const cycle = (year - 1) % 30;
  return [2, 5, 7, 10, 13, 15, 18, 21, 24, 26, 29].includes(cycle);
}

export function getHijriDaysInMonth(month, year) {
  if (month % 2 === 1) return 30;
  if (month === 12 && isHijriKabisat(year)) return 30;
  return 29;
}

export const bulanHijriyah = [
  'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
  'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Syaban',
  'Ramadhan', 'Syawal', 'Dzulkaidah', 'Dzulhijjah'
];
