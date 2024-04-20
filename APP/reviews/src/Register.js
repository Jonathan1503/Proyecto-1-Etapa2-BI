import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import './Register.css';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setError('');
    setSuccess(false);
    try {
      const newUser = {
        correo: email,
        password: password,
        nombre: name,
        reviews: {},
        modelos: {}
      };

      const response = await axios.post("http://127.0.0.1:8000/predict/register", newUser);
      setSuccess(true);
      alert('Registro exitoso, inicia sesión para usar la página!');
      navigate('/');
    } catch (error) {
      setError('Error al registrar el usuario');
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <Card.Body>
          <img className="logo" src={logo} alt="Logo" />
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirme su contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button id="boton" type="submit" className="w-100 mt-3 rounded-pill">
              Registrarse
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RegisterForm;
