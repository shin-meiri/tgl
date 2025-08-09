// components/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-green-700 to-blue-800 text-white p-6 shadow-lg">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Primbon Jawa</h1>
        <p className="text-lg opacity-90">Cek Weton, Jodoh, Rezeki & Watak Jawa Kuno</p>
        <div className="mt-3 text-sm opacity-80">
          Berdasarkan Kalender Jawa • Saptawara & Pancawara
        </div>
      </div>
    </header>
  );
};

export default Header;
