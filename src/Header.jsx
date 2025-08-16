export default function Header({ active, onNavigate }) {
  return (
    <div className="header-nav">
      <div className={`nav-item ${active === 'kalender' ? 'active' : ''}`} onClick={() => onNavigate('kalender')}>
        📅 KALENDER
      </div>
      <div className={`nav-item ${active === 'deskripsi' ? 'active' : ''}`} onClick={() => onNavigate('deskripsi')}>
        ℹ️ DESKRIPSI
      </div>
    </div>
  );
}
