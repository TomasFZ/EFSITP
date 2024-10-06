import React from 'react';
import EventsList from './EventsList';
import { useAuth } from './AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      {user ? (
        <EventsList />
      ) : (
        <div className="welcome-container">
          <div className="welcome-message">
            <h2>¡Bienvenido a Eventos.com!</h2>
            <p>Aquí podrás encontrar y registrarte en los próximos eventos.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;