import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EventDetails() {
  const { id } = useParams(); // Obtener el ID del evento desde la URL
  const [eventDetails, setEventDetails] = useState(null);
  const token = localStorage.getItem('token');
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

  const handleSubscribe = async (eventDetails) => {
    try {
      const userId = localStorage.getItem('userId');
      // Fetch de event-location para obtener el número de locations disponibles
      console.log("http://localhost:3001/api/event-location/" + id)
      console.log("ESTOY ACAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
      console.log("EL ID DE EVENT LOCATION DEL EVENT AL QUE TE QUERES SUSCRIBIR ES: " + eventDetails.id_event_location)

      const locationResponse = await axios.get(`http://localhost:3001/api/event-location/${eventDetails.id_event_location}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Header Sub Pass");
      console.log(locationResponse.data[0].max_capacity); //aca ya sacás la max_capacity por probar viste. locationResponse.data[0].max_capacity
      const totalLocations = locationResponse.data.length;  //la cantidad de plazas disponibles no es la max_capacity, sino la cantidad de event_locations para dicho evento. Es decir, la cantidad de lugares/localizaciones en las que se va a dar el evento. 
      setLocations(prev => ({ ...prev, [eventDetails.id_event_location]: totalLocations }));

      // Fetch de event-enrollment para obtener los usuarios suscritos
      console.log("Header Enroll");
      console.log(eventDetails)
      const enrollmentResponse = await axios.get(`http://localhost:3001/api/event/${eventDetails.event_id}/enrollment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Header Enroll Pass");
      console.log(enrollmentResponse.data.collection.length)
      const enrolledUsers = enrollmentResponse.data.collection.length;
      setEnrollments(prev => ({ ...prev, [eventDetails.id]: enrolledUsers }));

      // Verificar si hay espacios disponibles
      console.log("enrolled users: "+ enrolledUsers)
      console.log("totalLocations: "+ totalLocations)

      if (enrolledUsers > totalLocations) { //cambiar a < después NO OLVIDARSE
        const subscribeResponse = await axios.post(`http://localhost:3001/api/event/${eventDetails.event_id}/enrollment`, {
          userId: userId, //el id del usuario sacar
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert(`Te has suscrito al evento con ID: ${eventDetails.id}`);
        // Aquí iría el código para realizar la suscripción, si procede
      } else {
        alert('No hay más cupos disponibles para este evento.');
      }
    } catch (error) {
      console.error('Error during subscription process:', error);
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
      {/* Recorrer los detalles del evento */}
      <ul>
        {Object.entries(eventDetails).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> 
            {typeof value === 'object' && value !== null ? (
              <pre>{JSON.stringify(value, null, 2)}</pre> // Mostrar objetos como JSON formateado
            ) : (
              value
            )}
          </li>
        ))}
      </ul>

      {/* Botón para suscribirse al evento */}
      <button onClick={() => handleSubscribe(eventDetails)}>Suscribirse</button>
      </div>
  );
}

export default EventDetails;
