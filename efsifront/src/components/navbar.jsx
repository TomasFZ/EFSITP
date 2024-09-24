import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ imagen, user }) {
  return (
    <header>
      <nav className="navbar">
        <div className="logo"> 
          <img alt="Logo" src={imagen} />
          <Link to="/">Eventos.com</Link>
        </div>
        <ul>
          <li><Link to="/">Home</Link></li>
          {user ? (
            <li className="user-info">
              <span>{user}</span> {/* Mostrar el nombre de usuario */}
            </li>
          ) : (
            <>
              <li><Link to="/login">Iniciar sesión</Link></li>
              <li><Link to="/register">Registrarse</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
