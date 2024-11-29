import './App.css';
import Navbar from './components/navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Home from './pages/Home';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import EventsList from './pages/EventsList'; // Importar la lista de eventos
import EventDetails from './pages/EventDetails'; // Importar el componente de detalles del evento
import EventCategories from './pages/EventCategories';
import EventLocations from './pages/EventLocations';

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
          <Route path="/categories" element={<EventCategories />} />
          <Route path="/locations" element={<EventLocations />} />
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