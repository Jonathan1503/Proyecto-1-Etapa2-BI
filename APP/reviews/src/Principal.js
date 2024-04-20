import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de tener instalado react-router-dom
import { useNavigate } from 'react-router-dom';
import './Principal.css';

function PaginaPrincipal() {

    const navigate = useNavigate();
    const cerrar = () => {
        sessionStorage.removeItem('correo');
        alert('Salida exitosa!');
        navigate('/');
      };
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <button className="btn btn-secondary cerrar-button" onClick={cerrar}>Cerrar Sesión</button>
      <div style={{ flex: 1, backgroundColor: 'lightblue', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Link to="/predicciones-txt" style={{ textDecoration: 'none', color: 'black' }}>
          <h1 style={{ fontWeight: 'bold' }}>Generar predicciones (texto)</h1>
        </Link>
      </div>
      <div style={{ flex: 1, backgroundColor: 'lightgreen', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Link to="/predicciones-csv" style={{ textDecoration: 'none', color: 'black' }}>
          <h1 style={{ fontWeight: 'bold' }}>Generar predicciones (CSV)</h1>
        </Link>
      </div>
      <div style={{ flex: 1, backgroundColor: 'lightcoral', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Link to="/entrenar" style={{ textDecoration: 'none', color: 'black' }}>
          <h1 style={{ fontWeight: 'bold' }}>Entrenar modelo</h1>
        </Link>
      </div>
    </div>
  );
}

export default PaginaPrincipal;
