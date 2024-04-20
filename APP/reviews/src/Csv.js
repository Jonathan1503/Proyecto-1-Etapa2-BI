import React, { useState } from 'react';
import axios from 'axios';
import './Csv.css';
import { useNavigate } from 'react-router-dom';

function PrediccionesCSV() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [graph, setGraph] = useState(null);
  const [csvData, setCsvData] = useState(null); // Almacenar los datos CSV en formato JSON
  const [downloadReady, setDownloadReady] = useState(false);
  const navigate = useNavigate();

  const onFileChange = event => {
    setFile(event.target.files[0]);
  };
  const goHome = () => {
    navigate('/home');
  };


  const onFileUpload = () => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    axios.post("http://127.0.0.1:8000/predict/csv", formData)
      .then(response => {
        const data = response.data;
        setCsvData(data.csv_data);
        setStatistics(data.stats);
        setGraph(data.graph);
        setUploading(false);
        setDownloadReady(true); 
      })
      .catch(error => {
        console.error('Error:', error);
        setUploading(false);
      });
  };

  // Función para generar y descargar el CSV
  const downloadCSV = () => {
    const csvRows = csvData.map(row => Object.values(row).join(",")).join("\n");
    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'predicciones.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  return (
    <div className="container mt-5">
    <button className="btn btn-secondary home-button" onClick={goHome}>Volver a Inicio</button>
      <h2>Subir archivo CSV para predicción</h2>
      <input type="file" onChange={onFileChange} accept=".csv" className="form-control-file mt-2" />
      <button className={`btn btn-primary mt-3 ${uploading ? 'd-none' : ''}`} onClick={onFileUpload} disabled={uploading || !file}>
        Subir Archivo
      </button>
      {uploading && (
        <div className="progress mt-3">
          <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: "100%"}}></div>
        </div>
      )}
      {downloadReady && (
        <button className="btn btn-dark btn-lg mt-3" onClick={downloadCSV}>Descargar Resultados CSV</button>
      )}
      {statistics && (
        <div>
          <h3>Estadísticas</h3>
          <ul>
            <li>Máximo: {statistics.maximo}</li>
            <li>Mínimo: {statistics.minimo}</li>
            <li>Promedio: {statistics.promedio}</li>
            <li>Desviación Estándar: {statistics.desviacion_estandar}</li>
            <li>Total de Registros: {statistics.cantidad_de_registros}</li>
          </ul>
        </div>
      )}
      {graph && (
        <div>
          <h3>Gráfico</h3>
          <img src={`data:image/png;base64,${graph}`} alt="Gráfico de Distribución de Ratings" className="img-fluid"/>
        </div>
      )}
    </div>
  );
}

export default PrediccionesCSV;
