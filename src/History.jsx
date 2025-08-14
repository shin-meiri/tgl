// src/utils/History.jsx

/**
 * Cek apakah suatu tahun adalah tahun kabisat
 * Julian (sebelum 1582): habis dibagi 4
 * Gregorian (1582+): habis dibagi 4, kecuali abad bukan kelipatan 400
 */
export function isKabisat(tahun) {
  if (tahun < 1 || !Number.isInteger(tahun)) {
    throw new Error('Tahun harus bilangan bulat positif');
  }

  if (tahun < 1582) {
    return tahun % 4 === 0; // Julian
  } else {
    return (tahun % 4 === 0) && (tahun % 100 !== 0 || tahun % 400 === 0); // Gregorian
  }
}

/**
 * Hitung hari dalam seminggu (untuk tahun historis)
 * Menggunakan Zeller's Congruence (Julian & Gregorian)
 */
export function hitungHari(tanggal, bulan, tahun) {
  let m = bulan;
  let y = tahun;

  if (bulan < 3) {
    m += 12;
    y -= 1;
  }

  let h;
  if (tahun < 1582 || (tahun === 1582 && bulan < 10) || (tahun === 1582 && bulan === 10 && tanggal < 15)) {
    // Julian Calendar
    h = (tanggal + Math.floor((13 * (m + 1)) / 5) + y + Math.floor(y / 4) + 5) % 7;
  } else {
    // Gregorian Calendar
    const century = Math.floor(y / 100);
    h = (tanggal + Math.floor((13 * (m + 1)) / 5) + y + Math.floor(y / 4) + Math.floor(century / 4) - 2 * century + 5) % 7;
  }

  const days = ['Sabtu', 'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  return days[h];
}

/**
 * Jumlah hari dalam bulan tertentu
 */
export function getDaysInMonth(bulan, tahun) {
  if (bulan === 1) { // Februari
    return isKabisat(tahun) ? 29 : 28;
  }
  const days = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[bulan];
}
