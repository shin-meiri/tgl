import React from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Tetap butuh dasar (tidak bisa dihindari)

const Kalender = () => {
  const options = {
    dateFormat: "Y-m-d",
    defaultDate: "today",
    inline: false, // Dropdown, bukan inline permanen
    altInput: true,
    altFormat: "J F Y", // Tampilan di input: "5 Maret 2025"
    allowInput: false,
    clickOpens: true,

    // Custom theme agar lebih ringan, mirip Excel
    theme: 'light',
  };

  return (
    <div
      style={{
        display: 'inline-block',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        width: '220px',
      }}
    >
      <Flatpickr
        options={options}
        render={({ defaultValue, value, ...props }, ref) => {
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #aaa',
                borderRadius: '4px',
                padding: '6px 8px',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: '#fff',
              }}
              onClick={(e) => {
                // Trigger flatpickr
                ref.current?.click();
              }}
            >
              <span style={{ marginRight: '8px', fontSize: '16px' }}>🗓️</span>
              <input
                ref={ref}
                type="text"
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  flexGrow: 1,
                  cursor: 'pointer',
                }}
                readOnly
                {...props}
                value={value || defaultValue || ''}
              />
            </div>
          );
        }}
      />

      <style jsx="true">{`
        /* Minimal styling agar tidak terlalu "flatpickr" */
        .flatpickr-calendar {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-family: Arial, sans-serif;
          width: 300px !important;
          padding: 0;
        }

        .flatpickr-weekdays {
          background-color: #f0f0f0;
          padding: 6px 0;
        }

        .flatpickr-weekday {
          color: #333;
          font-weight: bold;
          font-size: 12px;
        }

        .dayContainer {
          padding: 8px;
        }

        .flatpickr-day {
          width: 36px;
          height: 36px;
          line-height: 36px;
          border-radius: 4px;
          margin: 2px;
          font-size: 13px;
        }

        .flatpickr-day.today {
          background-color: #e6f7ff;
          border: 1px solid #1890ff;
          color: #1890ff;
        }

        .flatpickr-day.selected {
          background-color: #1890ff;
          color: white;
        }

        .flatpickr-day.prevMonthDay,
        .flatpickr-day.nextMonthDay {
          color: #ccc;
        }
      `}</style>
    </div>
  );
};

export default Kalender;
