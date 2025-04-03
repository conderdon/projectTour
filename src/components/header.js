// Header.js
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

const types = [
  "Пешие", "Машинные", "Конные", "Культурные","Вело",
];

const Header = ({ setSelectedType }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    navigate(`/sort/${type}`, { state: { selectedType: type } });
  };

  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search`, { state: { searchQuery } });
    }
  };

  return (
    <div className="header">
      <a href="http://localhost:3001">Домой</a>

      {/* Гамбургер-меню для мобильных */}
      <div className={`dropdown ${burgerMenuOpen ? 'active' : ''}`}>
        <button className="dropbtn">Типы туров</button>
        <div className="dropdown-content">
          {types.map((type, index) => (
            <a
              key={index}
              href={type}
              onClick={() => handleTypeSelect(type)}
            >
              {type}
            </a>
          ))}
        </div>
      </div>


      <input
        id="searchInput"
        type="text"
        placeholder="Поиск по названию"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button id="searchBtn" onClick={handleSearch}>
        Поиск
      </button>

      
    </div>
  );
};

export default Header;
