import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/api/event', {
          headers: {
            Authorization: `Bearer ${token}`, // Usar el token almacenado
          },
        });
        console.log(response.data.collection)
        setEvents(response.data.collection);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-list">
      <h2>Eventos Disponibles</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
