// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// function EventDetails() {
//   const { id } = useParams(); // Obtener el ID del evento desde la URL
//   const [eventDetails, setEventDetails] = useState(null);
//   const token = localStorage.getItem('token');
//   const [locations, setLocations] = useState({});
//   const [enrollments, setEnrollments] = useState({});

//   useEffect(() => {
//     // Fetch para obtener los detalles del evento
//     const fetchEventDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3001/api/event/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setEventDetails(response.data);
//       } catch (error) {
//         console.error("Error fetching event details:", error);
//       }
//     };

//     fetchEventDetails();
//   }, [id, token]);

//   if (!eventDetails) {
//     return <div>Cargando detalles del evento...</div>;
//   }

//   const handleSubscribe = async (eventId) => {
//     try {
//       // Fetch de event-location para obtener el número de locations disponibles
      
//       const locationResponse = await axios.get(`http://localhost:3001/api/event-location/${eventId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log("Header Sub Pass")
//       const totalLocations = locationResponse.data.length;
//       setLocations(prev => ({ ...prev, [eventId]: totalLocations }));

//       // Fetch de event-enrollment para obtener los usuarios suscritos
//       console.log("Header Enroll")
//       const enrollmentResponse = await axios.get(`http://localhost:3001/api/${eventId}/enrollment`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log("Header Enroll Pass")
//       const enrolledUsers = enrollmentResponse.data.users.length;
//       setEnrollments(prev => ({ ...prev, [eventId]: enrolledUsers }));

//       // Verificar si hay espacios disponibles
//       if (enrolledUsers < totalLocations) {
//         alert(`Te has suscrito al evento con ID: ${eventId}`);
//         // Aquí iría el código para realizar la suscripción, si procede
//       } else {
//         alert('No hay más cupos disponibles para este evento.');
//       }
//     } catch (error) {
//       console.error('Error during subscription process:', error);
//     }
//   };

//   return (
//     <div>
//     <button onClick={() => handleSubscribe(id)}>Suscribirse</button>
//       <h2>Detalles del Evento: {eventDetails.name}</h2>
//       <p>Descripción: {eventDetails.description}</p>
//       <p>Fecha: {eventDetails.date}</p>
//       {/* Recorrer los detalles del evento */}
//       <ul>
//         {Object.entries(eventDetails).map(([key, value]) => (
//           <li key={key}>
//             <strong>{key}:</strong> 
//             {typeof value === 'object' && value !== null ? (
//               <pre>{JSON.stringify(value, null, 2)}</pre> // Mostrar objetos como JSON formateado
//             ) : (
//               value
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default EventDetails;

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

  const handleSubscribe = async (eventId) => {
    try {
      // Fetch de event-location para obtener el número de locations disponibles
      console.log("http://localhost:3001/api/event-location/" + id)
      const locationResponse = await axios.get(`http://localhost:3001/api/event-location/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Header Sub Pass");
      const totalLocations = locationResponse.data.length;
      setLocations(prev => ({ ...prev, [eventId]: totalLocations }));

      // Fetch de event-enrollment para obtener los usuarios suscritos
      console.log("Header Enroll");
      const enrollmentResponse = await axios.get(`http://localhost:3001/api/${eventId}/enrollment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Header Enroll Pass");
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
      <button onClick={() => handleSubscribe(id)}>Suscribirse</button>
    </div>
  );
}

export default EventDetails;
