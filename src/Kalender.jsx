import React, { useState, useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import axios from 'axios';

const App = () => {
  const [date, setDate] = useState(new Date());
  const flatpickrRef = useRef(null);

  // Format tanggal sebagai MM/DD/YYYY
  const formatDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Handle navigasi bulan
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(date);
    if (direction === 'prev') {
      newDate.setMonth(date.getMonth() - 1);
    } else {
      newDate.setMonth(date.getMonth() + 1);
    }
    setDate(newDate);
    // Optional: trigger Flatpickr to update view
    if (flatpickrRef.current) {
      flatpickrRef.current.flatpickr?.setDate(newDate);
    }
  };

  // Contoh fetch data dengan Axios
  const fetchData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
      console.log('Data dari API:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>📅 Kalender dengan Navigasi Bulan (Seperti Excel)</h2>

      {/* Tombol Navigasi & Tanggal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => navigateMonth('prev')}
          style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Previous Month"
        >
          ⬅️
        </button>

        <span
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontWeight: 'bold',
            minWidth: '100px',
            textAlign: 'center',
          }}
        >
          {formatDate(date)}
        </span>

        <button
          onClick={() => navigateMonth('next')}
          style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Next Month"
        >
          ➡️
        </button>
      </div>

      {/* Flatpickr Date Picker */}
      <div style={{ marginBottom: '20px' }}>
        <Flatpickr
          ref={flatpickrRef}
          value={date}
          options={{
            dateFormat: 'm/d/Y',
            onChange: (selectedDates) => setDate(selectedDates[0]),
            allowInput: true,
          }}
          style={{
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Tombol Contoh Axios */}
      <button
        onClick={fetchData}
        style={{
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        🔁 Fetch Data (Axios)
      </button>
    </div>
  );
};

export default App;
