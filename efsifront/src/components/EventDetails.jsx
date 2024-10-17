import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

function EventDetails() {
  const { id } = useParams(); // Obtener el ID del evento desde la URL
  const [eventDetails, setEventDetails] = useState(null);
  // eslint-disable-next-line
  const { token, userId, user } = useAuth(); // Usar el hook useAuth para obtener token y userId
  console.log("Token AUTH:", token);
  console.log("UserId AUTH:", userId);
  // eslint-disable-next-line
  const [locations, setLocations] = useState({});
  // eslint-disable-next-line
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
      setLocations(prev => ({ ...prev, [eventDetails.id_event_location]: totalLocations }));
  
      // Fetch de event-enrollment para obtener los usuarios suscritos
      const enrollmentResponse = await axios.get(`http://localhost:3001/api/event/${eventDetails.event_id}/enrollment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Verificar si el usuario ya está inscrito
      // eslint-disable-next-line
      const isAlreadyEnrolled = enrollmentResponse.data.collection.some(user => user.username === user.username);
      
      if (isAlreadyEnrolled) {
        alert('Ya estás suscrito a este evento.');
        return; // Detener el proceso si ya está inscrito
      }
  
      const enrolledUsers = enrollmentResponse.data.collection.length;
      
      // Verificar si hay espacios disponibles
      if (enrolledUsers < totalLocations) { // Usar < para permitir la suscripción
        // eslint-disable-next-line
        const subscribeResponse = await axios.post(`http://localhost:3001/api/event/${eventDetails.event_id}/enrollment`, {
          userId: userId, // Consigue el userId desde el authContext
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
      console.error('Error durante el proceso de suscripción:', error);
    }
  };

  if (!eventDetails) {
    return <div>Cargando detalles del evento...</div>;
  }

  return (
    <div className='detailsEvent'>
      <h1>{eventDetails.event_name}</h1>
      <h2>Detalles del Evento:</h2>
      <p>Descripción: {eventDetails.event_description}</p>
      <p>Fecha de inico: {eventDetails.start_date}</p>
      <p>Duración del evento: {eventDetails.duration_in_minutes} Min.</p>
      <p>Asistencia máxima: {eventDetails.max_assistance}</p>
      <p>Dirección: {eventDetails.event_location_full_address}</p>
      <p>Categoría: {eventDetails.event_category_name}</p>
      <button className='create-event-form' style={{padding: "20px 40px", display: "block", margin: "auto", marginTop: "10rem"}} onClick={handleSubscribe}>Suscribirse</button>
    </div>
  );
}

export default EventDetails;
