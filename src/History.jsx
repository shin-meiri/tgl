// src/utils/History.jsx

/**
 * Hitung Julian Day Number (JDN) untuk tanggal
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
    // Gregorian
    const a = Math.floor(y / 100);
    b = 2 - a + Math.floor(a / 4);
  } else {
    // Julian
    b = 0;
  }

  const jd = Math.floor(365.25 * (y + 4716)) +
             Math.floor(30.6001 * (m + 1)) +
             day + b - 1524;

  return Math.floor(jd);
}

/**
 * Hitung hari dalam seminggu (Senin - Minggu)
 * Berdasarkan JDN
 */
export function hitungHari(day, month, year) {
  const jdn = julianDayNumber(day, month, year);
  const baseJDN = 1721426; // 1 Januari 1 M = Senin
  const selisih = jdn - baseJDN;
  const hari = (selisih % 7 + 7) % 7; // Aman dari negatif
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  return days[hari];
}

/**
 * Cek apakah tahun kabisat
 */
export function isKabisat(tahun) {
  if (tahun < 1582) {
    return tahun % 4 === 0; // Julian
  } else {
    return (tahun % 4 === 0) && (tahun % 100 !== 0 || tahun % 400 === 0); // Gregorian
  }
}

/**
 * Jumlah hari dalam bulan
 */
export function getDaysInMonth(bulan, tahun) {
  if (bulan === 1) { // Februari
    return isKabisat(tahun) ? 29 : 28;
  }
  const days = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[bulan];
}
