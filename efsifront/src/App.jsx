import './App.css';
import Navbar from './components/navbar';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Home from './components/Home';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './components/AuthContext';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import EventsList from './components/EventsList'; // Importar la lista de eventos
import EventDetails from './components/EventDetails'; // Importar el componente de detalles del evento


function AppContent() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Navbar
        imagen="Portfolio-EFSI/src/vendor/imagen1.png"
        user={user}
        className="navbar"
      />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<Home />} />

          {/* Rutas para los eventos */}
          <Route path="/events" element={<EventsList />} />
          <Route path="/event/:id" element={<EventDetails />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;