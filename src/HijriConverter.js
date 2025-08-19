// src/utils/HijriConverter.js
import { julianDayNumber } from './History'; // Pastikan pakai JDN akurat

export function masehiToHijri(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const jdn0 = 1948340; // 16 Juli 622 M (Julian) = 1 Muharram 1 H
  const days = jdn - jdn0;
  const monthCount = Math.floor(days / 29.530588853);
  const hijriYear = Math.floor((monthCount + 1) / 12) + 1;
  const hijriMonth = ((monthCount + 1) % 12) || 12;
  const hijriDay = Math.floor(jdn - (jdn0 + monthCount * 29.530588853) + 1);
  return {
    day: Math.max(1, Math.min(Math.ceil(hijriDay), 30)),
    month: hijriMonth,
    year: hijriYear
  };
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
