import React from 'react';
import { Link } from 'react-router-dom';
import eventosLogo2 from '../vendor/eventosLogo2.jpg'; // Importa la imagen

function Navbar({ user }) {
  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <img alt="Logo" src={eventosLogo2} /> {/* Usa la imagen importada */}
          <Link to="/">Eventos.com</Link>
        </div>
        <ul>
          <li><Link to="/">Home</Link></li>
          {user ? (
            <>
              <li><Link to="/logout">Cerrar Sesión</Link></li>
              <li className="user-info">
                <span>{user}</span>
              </li>
            </>
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
