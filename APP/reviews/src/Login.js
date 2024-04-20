import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from './logo.png';
import axios from 'axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dict = {
      "correo": email,
      "password": password
    };
    
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict/login", dict);
      sessionStorage.setItem('correo', email);
      navigate('/home');
    } catch (error) {
      setError(`Login failed: ${error.response ? error.response.data.message : error.message}`);
      console.error('Error', error);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="mb-4 logo" />
      <Card className="login-card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Ingresar
            </Button>
            {error && <div className="error-message">{error}</div>}
          </Form>
          <p className="text-center mt-3">
            <a href="/register">Regístrate</a>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LoginForm;
