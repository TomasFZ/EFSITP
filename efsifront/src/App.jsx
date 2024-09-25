import './App.css';
import Navbar from './components/navbar';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import EventsList from './components/EventsList';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleRegister = (username) => {
    setUsername(username);
  };

  const handleLogin = (username) => {
    setUsername(username);
  };

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Navbar
        imagen="Portfolio-EFSI/src/vendor/imagen1.png"
        user={username}
        className="navbar"
      />

      <Routes>
        <Route path="/login" element={username ? <Navigate to="/events" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={username ? <Navigate to="/events" /> : <Register onRegister={handleRegister} />} />
        <Route path="/events" element={username ? <EventsList /> : <Navigate to="/login" />} />
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
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