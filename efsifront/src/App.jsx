import './App.css';
import Navbar from './components/navbar';
import Register from './components/Register';
import Login from './components/Login';
import EventsList from './components/EventsList';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [username, setUsername] = useState(null);

  const handleRegister = (username) => {
    setUsername(username);
  };

  const handleLogin = (username) => {
    setUsername(username);
  };

  return (
    <Router>
      <Navbar
        imagen="Portfolio-EFSI/src/vendor/imagen1.png"
        user={username}
        className="navbar"
      />

      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/" element={<Welcome />} />
      </Routes>
    </Router>
  );
}

function Welcome() {
  return (
    <div className="welcome-message">
      <h2>¡Bienvenido a Eventos.com!</h2>
      <p>Aquí podrás encontrar y registrarte en los próximos eventos.</p>
    </div>
  );
}

export default App;