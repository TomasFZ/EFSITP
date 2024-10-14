import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

function EventDetails() {
  const { id } = useParams(); // Obtener el ID del evento desde la URL
  const [eventDetails, setEventDetails] = useState(null);
  const { token, userId } = useAuth(); // Usar el hook useAuth para obtener token y userId
  const [locations, setLocations] = useState({});
  const [enrollments, setEnrollments] = useState({});

  useEffect(() => {
    // Fetch para obtener los detalles del evento
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/event/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEventDetails(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [id, token]);

  const handleSubscribe = async () => {
    try {
      // Fetch de event-location para obtener el número de locations disponibles
      const locationResponse = await axios.get(`http://localhost:3001/api/event-location/${eventDetails.id_event_location}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const totalLocations = locationResponse.data.length;  
      console.log("totalLocations: " + totalLocations);
      setLocations(prev => ({ ...prev, [eventDetails.id_event_location]: totalLocations }));
        console.log("el userId del handlesubscribe: " + userId)
      // Fetch de event-enrollment para obtener los usuarios suscritos
      const enrollmentResponse = await axios.get(`http://localhost:3001/api/event/${eventDetails.event_id}/enrollment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const enrolledUsers = enrollmentResponse.data.collection.length;
      console.log("enrolledUsers: " + enrolledUsers);
      setEnrollments(prev => ({ ...prev, [eventDetails.id]: enrolledUsers }));
        console.log("el userId del handlesubscribe: " + userId)
      // Verificar si hay espacios disponibles
      if (enrolledUsers > totalLocations) { // Asegúrate de usar < para permitir la suscripción
        const subscribeResponse = await axios.post(`http://localhost:3001/api/event/${eventDetails.event_id}/enrollment`, {
          userId: userId, // Obtener el userId desde el authContext
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert(`Te has suscrito al evento con ID: ${eventDetails.id}`);
      } else {
        alert('No hay más cupos disponibles para este evento.');
      }
    } catch (error) {
      console.error('Error during subscription process:', error);
      console.log("user id: " + userId);
      console.log("token: " + token);
    }
  };

  if (!eventDetails) {
    return <div>Cargando detalles del evento...</div>;
  }

  return (
    <div>
      <h2>Detalles del Evento: {eventDetails.name}</h2>
      <p>Descripción: {eventDetails.description}</p>
      <p>Fecha: {eventDetails.date}</p>
      <ul>
        {Object.entries(eventDetails).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> 
            {typeof value === 'object' && value !== null ? (
              <pre>{JSON.stringify(value, null, 2)}</pre>
            ) : (
              value
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleSubscribe}>Suscribirse</button>
    </div>
  );
}

export default EventDetails;
