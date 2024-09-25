import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3001/api/user/login', formData);
      
      if (response.data && response.data.includes('Token:')) {
        const token = response.data.split('Token: ')[1];
        localStorage.setItem('token', token);
        setMessage('Login exitoso');
        onLogin(formData.username);
      } else {
        setMessage('Error en el login. Por favor, verifica tus credenciales.');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      setMessage(error.response?.data || 'Error en el login. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      {message && <p className={message.includes('exitoso') ? 'success' : 'error'}>{message}</p>}
    </div>
  );
}

export default Login;