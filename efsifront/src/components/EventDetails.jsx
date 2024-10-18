import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

function EventDetails() {
  const { id } = useParams(); // saca el ID del evento desde la url
  const [eventDetails, setEventDetails] = useState(null);
  const { token, userId, user } = useAuth(); // useAuth token y userId
  console.log("Token AUTH:", token);
  console.log("UserId AUTH:", userId);
  const [locations, setLocations] = useState({});
  //const [enrollments, setEnrollments] = useState({});

  useEffect(() => {
    // Fetch detalles evento
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
  }, [id, token]); //si el token expira se re-renderiza (lo mismo el id del event)

  const handleSubscribe = async () => {
    try {
      // Fetch event-location numero de locations disponibles
      const locationResponse = await axios.get(`http://localhost:3001/api/event-location/${eventDetails.id_event_location}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const totalLocations = locationResponse.data.length;   //num locations disponibles
      setLocations(prev => ({ ...prev, [eventDetails.id_event_location]: totalLocations })); //???
  
      // Fetch event-enrollment para los usuarios suscritos
      const enrollmentResponse = await axios.get(`http://localhost:3001/api/event/${eventDetails.event_id}/enrollment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
     
      const isAlreadyEnrolled = enrollmentResponse.data.collection.some(user => user.username === user.username);
      
      if (isAlreadyEnrolled) {
        alert('Ya estás suscrito a este evento.');
        return; 
      }
  
      const enrolledUsers = enrollmentResponse.data.collection.length; //num de personas suscritas
      if (enrolledUsers < totalLocations) { 
        const subscribeResponse = await axios.post(`http://localhost:3001/api/event/${eventDetails.event_id}/enrollment`, {
          userId: userId, // Consigue el userId desde el authContext
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert(`Te has suscrito al event`);
      } else {
        alert('No hay mas cupos disponibles para este evento.');
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
