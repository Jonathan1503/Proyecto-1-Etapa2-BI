import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Txt.css';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function PrediccionesTexto() {
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [historicalPredictions, setHistoricalPredictions] = useState([]);
  const correo = sessionStorage.getItem('correo');
  const navigate = useNavigate();

  useEffect(() => {
    cargarPrediccionesHistoricas();
  }, []);

  const handleTextChange = event => {
    setText(event.target.value);
  };

  const cargarPrediccionesHistoricas = () => {
    axios.post("http://127.0.0.1:8000/predict/lastreviews",{correo : correo})
      .then(response => {
        const predictions = JSON.parse(response.data.data);
        const historicalData = Object.entries(predictions).map(([review, rating]) => ({ Review: review, Rating: rating }));
        setHistoricalPredictions(historicalData);
      })
      .catch(error => {
        console.error('Error al cargar predicciones históricas:', error);
      });
  };

  const onSubmitText = () => {
    setUploading(true);
    axios.post("http://127.0.0.1:8000/predict/txt", { reviews: text , correo: correo})
      .then(response => {
        setResults(response.data.data);
        setUploading(false);
      })
      .catch(error => {
        console.error('Error al obtener resultados de predicción:', error);
        setUploading(false);
      });
  };

  const renderStars = rating => {
    let stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }
    return stars;
  };
  const goHome = () => {
    navigate('/home');
  };

  return (
    <div className="predictions-bg">
        <button className="btn btn-secondary home-button" onClick={goHome}>Volver a Inicio</button>
      <h2 className="my-4 text-center">Introduce texto para predicción</h2>
      <textarea className="form-control custom-textarea" onChange={handleTextChange} value={text} placeholder="Separar reviews con |$|"></textarea>
      <button className="btn btn-primary custom-button" onClick={onSubmitText} disabled={uploading || !text}>
        {uploading ? 'Procesando...' : 'Enviar Texto'}
      </button>
      {uploading && (
        <div className="progress w-50">
          <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: "100%"}}></div>
        </div>
      )}
      <div className="row mt-4">
        <div className="col-md-6">
          {results.length > 0 && (
            <div>
              <h3>Resultados de la predicción</h3>
              {results.map((item, index) => (
                <div key={index} className="card-container">
                  <div className="card review-card">
                    <div className="card-body">
                      <p className="card-text">{item.Reviews}</p>
                    </div>
                  </div>
                  <div className="card stars-card">
                    <div className="stars">
                      {renderStars(item.Rating)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-md-6">
          {historicalPredictions.length > 0 && (
            <div>
              <h3>Predicciones Históricas</h3>
              <ul className="list-group">
                {historicalPredictions.map((prediction, index) => (
                   <div key={index} className="card-container">
                     <div className="card review-card">
                       <div className="card-body">
                         <p className="card-text">{prediction.Review}</p>
                       </div>
                     </div>
                     <div className="card stars-card">
                       <div className="stars">
                         {renderStars(prediction.Rating)}
                       </div>
                     </div>
                   </div>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}

export default PrediccionesTexto;
