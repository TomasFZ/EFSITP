import './App.css';
import Navbar from "./components/navbar.jsx";
import Register from "./components/Register.jsx"; // Importar el nuevo componente
import { useState } from 'react';

function App() {
  const [username, setUsername] = useState(null); // Almacena el nombre del usuario

  const handleRegister = (username) => {
    setUsername(username); // Actualiza el estado con el nombre de usuario
  };

  return (
    <>
      <div className="header">
        <Navbar 
          imagen="Portfolio-EFSI/src/vendor/imagen1.png" 
          user={username} // Pasar el nombre de usuario al componente Navbar
          className="navbar" 
        />
      </div>
      <Register onRegister={handleRegister} /> {/* Usar el componente de registro */}
    </>
  );
}

export default App;
