import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Entrenar.css';
import { useNavigate } from 'react-router-dom';

function EntrenarModelo() {
  const [trainingFile, setTrainingFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [trainingResults, setTrainingResults] = useState(null);
  const [modelo, setModelo] = useState(null);
  const navigate = useNavigate();

  const onTrainingFileChange = event => {
    setTrainingFile(event.target.files[0]);
  };

  const onTrainingFileUpload = () => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", trainingFile);
    
    axios.post("http://127.0.0.1:8000/predict/modelo", formData)
      .then(response => {
        setTrainingResults(response.data.data);
        setModelo(response.data.data.modelo);
        setUploading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setUploading(false);
      });
  };

  const downloadModel = () => {
    // Suponiendo que trainingResults.model_base64 contiene tu cadena base64
    const base64 = trainingResults.modelo_base64;
    console.log(base64);
    // Convertir base64 a un array de bytes
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
  
    // Crear un Blob con los datos en formato binario
    const blob = new Blob([byteArray], {type: 'application/octet-stream'});
  
    // Crear un enlace para la descarga
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'modelo.joblib'); // Asignar nombre de archivo para la descarga
  
    // Simular click en el enlace
    document.body.appendChild(link);
    link.click();
  
    // Limpiar el DOM y liberar recursos
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="entrenar-modelo-container">
      <Button className="btn btn-secondary home-button" onClick={() => navigate('/home')}>Volver a Inicio</Button>
      <div className="entrenar-modelo-content">
        <Card className="entrenar-modelo-card">
          <Card.Body>
            <h2 className="mb-4">Subir archivo CSV para entrenamiento</h2>
            <input type="file" onChange={onTrainingFileChange} accept=".csv" />
            <Button className="btn btn-primary mt-3" onClick={onTrainingFileUpload} disabled={uploading}>
              {uploading ? 'Entrenando...' : 'Entrenar'}
            </Button>
            {uploading && (
              <div className="progress mt-3">
                <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: "100%"}}></div>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
      {trainingResults && (
        <Card className="resultados-card">
          <Card.Body>
            <h3>Resultados del entrenamiento:</h3>
            <div>Precision: {trainingResults.precision}</div>
            <div>Recall: {trainingResults.recall}</div>
            <div>F1: {trainingResults.f1}</div>
            {trainingResults.confusion_matrix && (
              <div>
                <h4>Confusion Matrix:</h4>
                <img src={`data:image/png;base64,${trainingResults.confusion_matrix}`} alt="Confusion Matrix" id="imgg"/>
              </div>
            )}
            <Button className="btn btn-dark mt-3" onClick={downloadModel}>Descargar Modelo</Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default EntrenarModelo;
