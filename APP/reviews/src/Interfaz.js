import React, { useState } from 'react';
import axios from 'axios';

function Interfaz() {
  const [file, setFile] = useState(null);
  const [trainingFile, setTrainingFile] = useState(null);
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [trainingResults, setTrainingResults] = useState(null);

  const onFileChange = event => {
    setFile(event.target.files[0]);
  };

  const onTrainingFileChange = event => {
    setTrainingFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    axios.post("http://127.0.0.1:8000/predict/csv", formData)
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'output.csv');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        setUploading(false);
        alert('Archivo descargado');
      })
      .catch(error => {
        console.error('Error:', error);
        setUploading(false);
      });
  };

  const onTrainingFileUpload = () => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", trainingFile);
    
    axios.post("http://127.0.0.1:8000/predict/modelo", formData)
      .then(response => {
        setTrainingResults(response.data.data);
        setUploading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setUploading(false);
      });
  };

  const handleTextChange = event => {
    setText(event.target.value);
  };

  const onSubmitText = () => {
    setUploading(true);
    axios.post("http://127.0.0.1:8000/predict/txt", { reviews: text })
      .then(response => {
        setResults(response.data.data);
        setUploading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setUploading(false);
      });
  };

  return (
    <div className="container mt-5">
      <h2>Subir archivo CSV para predicción</h2>
      <input type="file" onChange={onFileChange} accept=".csv" />
      <button className="btn btn-primary mt-3" onClick={onFileUpload} disabled={uploading}>
        {uploading ? 'Subiendo y descargando...' : 'Subir y Descargar'}
      </button>

      <h2 className="mt-5">Subir archivo CSV para entrenamiento</h2>
      <input type="file" onChange={onTrainingFileChange} accept=".csv" />
      <button className="btn btn-primary mt-3" onClick={onTrainingFileUpload} disabled={uploading}>
        {uploading ? 'Entrenando...' : 'Entrenar'}
      </button>

      <h2 className="mt-5">Introduce texto para predicción</h2>
      <textarea className="form-control" onChange={handleTextChange} value={text} rows="5" placeholder="Separar reviews con |$|"></textarea>
      <button className="btn btn-primary mt-3" onClick={onSubmitText} disabled={uploading || !text}>
        {uploading ? 'Procesando...' : 'Enviar Texto'}
      </button>

      {uploading && (
        <div className="progress mt-3">
          <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: "100%"}}></div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4">
          <h3>Resultados de la predicción:</h3>
          <ul className="list-group">
            {results.map((item, index) => (
              <li key={index} className="list-group-item">
                <strong>Review:</strong> {item.Reviews} <br />
                <strong>Rating:</strong> {item.Rating}
              </li>
            ))}
          </ul>
        </div>
      )}

      {trainingResults && (
        <div className="mt-4">
          <h3>Resultados del entrenamiento:</h3>
          <div>Precision (SVM): {trainingResults.precision}</div>
          <div>Recall (SVM): {trainingResults.recall}</div>
          <div>F1 (SVM): {trainingResults.f1}</div>
          {trainingResults.confusion_matrix && (
            <div>
              <h4>Confusion Matrix:</h4>
              <img src={`data:image/png;base64,${trainingResults.confusion_matrix}`} alt="Confusion Matrix" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Interfaz;
