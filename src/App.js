import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import React, { useState } from 'react';
import List from './components/list';
import Admin from './components/admin';
import Sort from './components/sort';
import Header from './components/header';
import './App.css';
import Search from './components/search';
import Footer from "./components/footer";
import RequestForm from "./components/requestForm";

const App = () => {
  const [selectedGenre, setSelectedGenre] = useState("");

  
 

  return (
    <Router>
      <MainContent selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
    </Router>
  );
};

// Компонент, который рендерит Header в зависимости от пути
const MainContent = ({ selectedType, setSelectedType }) => {
  const location = useLocation(); // Получаем текущий путь

  return (
    <>
      {/* Условно рендерим Header, если не на странице '/admin' */}
      {location.pathname !== '/admin' && <Header setSelectedType={setSelectedType} />}
      
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/:type" element={<Sort selectedType={selectedType} />} />
        <Route path="/search" element={<Search />} />
        

        
      </Routes>
     
      {location.pathname !== '/admin' && <RequestForm />}
      {location.pathname !== '/admin' && <Footer />}
    </>
  );
};

export default App;
