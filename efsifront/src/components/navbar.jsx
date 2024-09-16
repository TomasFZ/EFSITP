function Navbar({ imagen, user }) {
    return (
      <header>
        <nav className="navbar">
          <div className="logo"> 
            <img alt="Logo" src={imagen.name} />
            Eventos.com
          </div>
          <ul>
            <li><a href="#home">Home</a></li>
            {user ? (
              <>
                <li className="user-info">
                  <img className="user-avatar" alt="User" src={user.photoUrl} />
                  <span>{user.name}</span>
                </li>
              </>
            ) : (
              <>
                <li><a href="#iniciar-sesion">Iniciar sesión</a></li>
                <li><a href="#registrarse">Registrarse</a></li>
              </>
            )}
          </ul>
        </nav>
      </header>
    );
  }
  
  export default Navbar;
  