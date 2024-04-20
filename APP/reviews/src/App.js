import React from 'react';
import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Login';
import RegisterForm from './Register';
import PaginaPrincipal from './Principal';
import PrediccionesCSV from './Csv';
import PrediccionesTexto from './Txt';
import EntrenarModelo from './Entrenar';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<PaginaPrincipal/>} />
          <Route path="/predicciones-csv" element={<PrediccionesCSV/>} />
          <Route path="/predicciones-txt" element={<PrediccionesTexto/>} />
          <Route path="/entrenar" element={<EntrenarModelo/>} />
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;