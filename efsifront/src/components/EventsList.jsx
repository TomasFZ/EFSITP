
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    id_event_category: "",
    id_event_location: "",
    start_date: "",
    duration_in_minutes: "",
    price: "",
    enabled_for_enrollment: true,
    max_assistance: ""
  });
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); //podria cambiar a que usen AuthContext. 
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const handleEventClick = (event) => {
    navigate(`/event/${event.id}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: name === 'enabled_for_enrollment' ? e.target.checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = { //hago uno nuevo pq si le paso directo newEvent no funciona
        ...newEvent,
        id_creator_user: parseInt(userId),
        id_event_category: parseInt(newEvent.id_event_category),
        id_event_location: parseInt(newEvent.id_event_location),
        duration_in_minutes: parseInt(newEvent.duration_in_minutes),
        price: parseFloat(newEvent.price),
        max_assistance: parseInt(newEvent.max_assistance)
      };

      const response = await axios.post('http://localhost:3001/api/event', eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });      
      // Fetch pq sino no aparece el recien creado hasta despues de recargar la pagina
      await fetchEvents();
      
      setNewEvent({//seteo en 0 al event
        name: "",
        description: "",
        id_event_category: "",
        id_event_location: "",
        start_date: "",
        duration_in_minutes: "",
        price: "",
        enabled_for_enrollment: true,
        max_assistance: ""
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="events-container">
      <div className="events-list">
        <h2>Eventos Disponibles</h2>
        <ul>
          {events.map(event => (
            <li key={event.id} onClick={() => handleEventClick(event)} style={{ cursor: 'pointer' }}>
              <span>{event.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="create-event-form">
        <h2>Crear Evento</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={newEvent.name} onChange={handleInputChange} placeholder="Nombre del evento" required />
          <textarea name="description" value={newEvent.description} onChange={handleInputChange} placeholder="Descripción" required />
          <input type="number" name="id_event_category" value={newEvent.id_event_category} onChange={handleInputChange} placeholder="ID Categoría del evento" required className="no-spinner" />
          <input type="number" name="id_event_location" value={newEvent.id_event_location} onChange={handleInputChange} placeholder="ID Ubicación del evento" required className="no-spinner" />
          <input type="datetime-local" name="start_date" value={newEvent.start_date} onChange={handleInputChange} required />
          <input type="number" name="duration_in_minutes" value={newEvent.duration_in_minutes} onChange={handleInputChange} placeholder="Duración (minutos)" required className="no-spinner" />
          <input type="number" name="price" value={newEvent.price} onChange={handleInputChange} placeholder="Precio" step="0.01" required className="no-spinner" />
          <label>
            <input type="checkbox" name="enabled_for_enrollment" checked={newEvent.enabled_for_enrollment} onChange={handleInputChange} />
            Habilitado para inscripción
          </label>
          <input type="number" name="max_assistance" value={newEvent.max_assistance} onChange={handleInputChange} placeholder="Asistencia máxima" required className="no-spinner" />
          <button type="submit">Crear Evento</button>
        </form>
      </div>
    </div>
  );
}

export default EventsList;