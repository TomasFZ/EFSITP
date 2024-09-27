import React from 'react';
import EventsList from './EventsList';

function Home({ username }) {
  return (
    <div className="home">
      {username ? (
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
