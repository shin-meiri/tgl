// src/components/Kalender.jsx
import React, { useState, useEffect } from 'react';
import Dtpick from './Dtpick';
import Tanggal from './Tanggal';

export default function Kalender() {
  const now = new Date();
  const defaultDay = now.getDate();
  const defaultMonth = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][now.getMonth()];
  const defaultYear = now.getFullYear();

  const [tanggal, setTanggal] = useState(`${defaultDay} ${defaultMonth} ${defaultYear}`);
  const [liburBulanIni, setLiburBulanIni] = useState([]);

  // Ekstrak bulan dan tahun dari tanggal
  const parse = () => {
    const parts = tanggal.split(' ');
    return {
      month: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].indexOf(parts[1]),
      year: parseInt(parts[2])
    };
  };

  const { month, year } = parse();

  // Ambil libur dari API
  useEffect(() => {
    fetch('https://namadomain.epizy.com/api/libur.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filter libur yang sesuai bulan & tahun
          const liburFilter = data.data.filter(item => {
            const tgl = new Date(item.tanggal);
            return tgl.getMonth() === month && tgl.getFullYear() === year;
          });
          setLiburBulanIni(liburFilter);
        }
      })
      .catch(err => {
        console.error('Gagal ambil libur:', err);
        setLiburBulanIni([]);
      });
  }, [tanggal, month, year]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '360px', margin: '0 auto' }}>
      {/* Input Pilih Tanggal */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '600' }}>
          Pilih Tanggal:
        </label>
        <Dtpick value={tanggal} onChange={setTanggal} />
      </div>

      {/* Kalender Bulan Penuh */}
      <div>
        <Tanggal tanggal={tanggal} />
      </div>

      {/* Legenda Warna */}
      <div style={{
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#f8f8f8',
        borderRadius: '6px',
        fontSize: '13px',
        color: '#333',
        border: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            backgroundColor: '#d32f2f',
            borderRadius: '50%',
            marginRight: '8px'
          }}></span>
          <span><strong>Merah:</strong> Minggu & Libur Nasional</span>
        </div>

        {/* Daftar Libur di Bulan Ini */}
        {liburBulanIni.length > 0 ? (
          <div>
            <strong>Libur di {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][month]} {year}:</strong>
            <ul style={{ marginTop: '4px', paddingLeft: '20px', fontSize: '12px' }}>
              {liburBulanIni.map((item, index) => {
                const tgl = new Date(item.tanggal);
                const hari = tgl.getDate();
                return (
                  <li key={index}>
                    {hari} {['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][tgl.getMonth()]}: <strong>{item.nama}</strong>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: '#777', marginTop: '6px' }}>
            Tidak ada libur nasional di bulan ini.
          </div>
        )}
      </div>
    </div>
  );
    }
