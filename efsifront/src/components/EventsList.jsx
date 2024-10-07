import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState({});
  const [enrollments, setEnrollments] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch inicial para cargar los eventos
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/event', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data.collection);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [token]);

  // Función para suscribirse a un evento
  const handleSubscribe = async (eventId) => {
    try {
      // Fetch de event-location para obtener el número de locations disponibles
      console.log("Header Sub")
      const locationResponse = await axios.get(`http://localhost:3001/api/event-location/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Header Sub Pass")
      const totalLocations = locationResponse.data.length;
      setLocations(prev => ({ ...prev, [eventId]: totalLocations }));

      // Fetch de event-enrollment para obtener los usuarios suscritos
      console.log("Header Enroll")
      const enrollmentResponse = await axios.get(`http://localhost:3001/api/${eventId}/enrollment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Header Enroll Pass")
      const enrolledUsers = enrollmentResponse.data.users.length;
      setEnrollments(prev => ({ ...prev, [eventId]: enrolledUsers }));

      // Verificar si hay espacios disponibles
      if (enrolledUsers < totalLocations) {
        alert(`Te has suscrito al evento con ID: ${eventId}`);
        // Aquí iría el código para realizar la suscripción, si procede
      } else {
        alert('No hay más cupos disponibles para este evento.');
      }
    } catch (error) {
      console.error('Error during subscription process:', error);
    }
  };

  return (
    <div className="events-list">
      <h2>Eventos Disponibles</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <span>{event.name}</span>
            <button onClick={() => handleSubscribe(event.id)}>Suscribirse</button>
            {locations[event.id] !== undefined && enrollments[event.id] !== undefined && (
              <div>
                <p>{`Lugares disponibles: ${locations[event.id] - enrollments[event.id]}`}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
