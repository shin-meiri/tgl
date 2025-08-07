import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [daftarLibur, setDaftarLibur] = useState({});
  const [cssLoaded, setCssLoaded] = useState(false);

  const hariIni = new Date();
  const EPOCH = new Date(1899, 11, 31);
  const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
  const hariNama = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const bulanNama = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const bulanPanjang = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const getWeton = (date) => {
    const diffTime = date - EPOCH;
    const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));
    return PASARAN[diffDays % 5];
  };

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    const prevLast = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: prevLast - i, isCurrentMonth: false, dayOfWeek: (6 - i) % 7, weton: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      days.push({
        date: day,
        isCurrentMonth: true,
        dayOfWeek: fullDate.getDay(),
        weton: getWeton(fullDate),
      });
    }

    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const next = new Date(year, month + 1, day);
      days.push({ date: day, isCurrentMonth: false, dayOfWeek: next.getDay(), weton: null });
    }

    setDaysInMonth(days);
  };

  // Muat CSS dari MySQL
  useEffect(() => {
    const loadCSS = async () => {
      try {
        const res = await axios.get('/api/theme.php');
        const css = res.data.css;

        const style = document.createElement('style');
        style.id = 'dynamic-css';
        style.textContent = css;

        const old = document.getElementById('dynamic-css');
        if (old) old.remove();
        document.head.appendChild(style);
      } catch (err) {
        console.error('Gagal muat CSS');
      } finally {
        setCssLoaded(true);
      }
    };
    loadCSS();
  }, []);

  // Muat libur
  useEffect(() => {
    axios.get('/api/libur.php')
      .then(res => {
        const liburMap = {};
        res.data.libur.forEach(l => {
          liburMap[l.tanggal] = l.nama;
        });
        setDaftarLibur(liburMap);
      })
      .catch(err => console.error('Gagal muat libur:', err));
  }, []);

  // Generate kalender
  useEffect(() => {
    if (cssLoaded) generateCalendarDays(currentDate);
  }, [currentDate, cssLoaded]);

  // Navigasi
  const prev = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const next = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const openPicker = () => setTempYear(currentDate.getFullYear()) && setShowMonthPicker(true);
  const selectMonth = (idx) => {
    setCurrentDate(d => {
      const c = new Date(d);
      c.setMonth(idx);
      c.setFullYear(tempYear || c.getFullYear());
      return c;
    });
    setShowMonthPicker(false);
  };
  const changeYear = (e) => {
    const v = e.target.value;
    if (/^\d{0,4}$/.test(v)) setTempYear(v === '' ? '' : Number(v));
  };
  const applyYear = () => tempYear && setCurrentDate(d => {
    const c = new Date(d);
    c.setFullYear(tempYear);
    return c;
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  if (!cssLoaded) return <div>Memuat tema...</div>;

  return (
    <div className="kalender-container">
      <div className="kalender-header">
        <button type="button" className="nav-btn" onClick={prev}>⬅️</button>
        <div className="month-display" onClick={openPicker}>{bulanPanjang[currentMonth]} {currentYear}</div>
        <button type="button" className="nav-btn" onClick={next}>➡️</button>
      </div>

      {showMonthPicker && (
        <div className="month-picker-overlay" onClick={e => e.stopPropagation()}>
          <div className="month-picker">
            <div className="year-input">
              <input
                type="number"
                value={tempYear}
                onChange={changeYear}
                onBlur={applyYear}
                onKeyPress={e => e.key === 'Enter' && applyYear()}
                placeholder="Tahun"
                className="year-edit"
              />
            </div>
            <div className="months-grid">
              {bulanNama.map((b, i) => (
                <div key={b} className={`month-cell ${i === currentMonth ? 'selected' : ''}`} onClick={() => selectMonth(i)}>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="hari-header">
        {hariNama.map(h => <div key={h} className={`hari-label ${h === 'Min' ? 'sunday' : ''}`}>{h}</div>)}
      </div>

      <div className="dates-grid">
        {daysInMonth.map((day, i) => {
          const fullDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`;
          const liburNama = daftarLibur[fullDateStr];
          const isToday = day.isCurrentMonth &&
            day.date === hariIni.getDate() &&
            currentMonth === hariIni.getMonth() &&
            currentYear === hariIni.getFullYear();

          return (
            <div
              key={i}
              className={[
                'date-box',
                !day.isCurrentMonth && 'outside',
                day.dayOfWeek === 0 && 'sunday',
                liburNama && 'libur',
                isToday && 'hari-ini'
              ].filter(Boolean).join(' ')}
              title={liburNama || ''}
            >
              <span className="date-number">{day.date}</span>
              {day.isCurrentMonth && <span className="weton">{day.weton}</span>}
              {liburNama && <span className="libur-badge">🎉</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Kalender;
