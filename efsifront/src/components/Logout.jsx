import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    onLogout();
    navigate('/');
  };

  return (
    <div className="logout-page">
      <h2>Cerrar Sesión</h2>
      <p>¿Estás seguro de que quieres cerrar sesión?</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default Logout;