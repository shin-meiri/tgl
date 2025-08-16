import React from 'react';

export default function Header({ active, onNavigate }) {
  return (
    <div className="header-nav">
      <div
        className={`nav-item ${active === 'kalender' ? 'active' : ''}`}
        onClick={() => onNavigate('kalender')}
      >
        <i className="icon">📅</i> KALENDER
      </div>
      <div
        className={`nav-item ${active === 'deskripsi' ? 'active' : ''}`}
        onClick={() => onNavigate('deskripsi')}
      >
        <i className="icon">📄</i> DESKRIPSI
      </div>
    </div>
  );
}
