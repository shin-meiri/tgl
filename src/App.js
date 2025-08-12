import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Kalender />} />
          <Route path="/hasil" element={<HasilWeton />} />
        </Routes>
      </div>
    </Router>
  );
    }
