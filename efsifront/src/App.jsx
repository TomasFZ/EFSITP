import './App.css';
import Navbar from './components/navbar';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Home from './components/Home';
import Footer from './components/Footer';
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
      <div className="app-container">
        <Navbar
          imagen="Portfolio-EFSI/src/vendor/imagen1.png"
          user={username}
          className="navbar"
        />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={username ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={username ? <Navigate to="/" /> : <Register onRegister={handleRegister} />} />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
            <Route path="/" element={<Home username={username} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;