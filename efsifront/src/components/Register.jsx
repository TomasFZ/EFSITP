import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      if (response.data.includes('Error')) {
        setMessage(response.data);
      } else {
        setMessage(response.data);
        onRegister(formData.username); // Pasar el nombre de usuario al padre
      }
    } catch (error) {
      setMessage(error.response ? error.response.data : 'Error en el registro');
    }
  };

  return (
    <div className="registration-form">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="Nombre"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Apellido"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
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
        <button type="submit">Registrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;