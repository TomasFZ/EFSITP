import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token); // Guardar token en el localStorage
        setMessage('Login exitoso');
        onLogin(formData.username); // Actualizar el nombre de usuario en el header
      } else {
        setMessage('Error en el login');
      }
    } catch (error) {
      setMessage(error.response ? error.response.data : 'Error en el login');
    }
  };

  return (
    <div className="login-form">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;