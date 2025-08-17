import Kalender from './Kalender';
import 'flatpickr/dist/flatpickr.min.css';

function App() {
  return (
    <div className="App">
      <Kalender />
    </div>
  );
}
// Di App.js atau index.js
useEffect(() => {
  fetch('/api/style.php')
    .then(res => res.text())
    .then(css => {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    })
    .catch(err => console.error('Gagal muat CSS:', err));
}, []);
export default App;
