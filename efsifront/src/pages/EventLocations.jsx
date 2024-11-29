import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EventLocations() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    id_location: "",
    name: "",
    full_address: "",
    max_capacity: "",
    latitude: "",
    longitude: "",
  });
  const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local.
  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/event-location', {
        headers: {
          Authorization: `Bearer ${token}`,

        },
      });
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleAddLocation = async () => {
    try {
      const { id_location, name, full_address, max_capacity, latitude, longitude } = newLocation;

      // Validaciones previas al envío
      if (!name || name.length < 3 || !full_address || full_address.length < 3) {
        alert("El nombre y la dirección deben tener al menos 3 caracteres.");
        return;
      }
      if (max_capacity <= 0) {
        alert("La capacidad máxima debe ser mayor a 0.");
        return;
      }

      await axios.post(
        'http://localhost:3001/api/event-location',
        {
          id_location: Number(id_location),
          name,
          full_address,
          max_capacity: Number(max_capacity),
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewLocation({
        id_location: "",
        name: "",
        full_address: "",
        max_capacity: "",
        latitude: "",
        longitude: "",
      });
      fetchLocations();
    } catch (error) {
      console.error("Error adding location:", error.response?.data || error.message);
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/event-location/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="event-locations-container">
      <h2 className="event-locations-title">Administrar Ubicaciones</h2>
      <ul className="event-locations-list">
        {locations.map(location => (
          <li key={location.id} className="event-locations-item">
            {location.name} - {location.full_address}
            <button onClick={() => handleDeleteLocation(location.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <div>
        <h3>Agregar Nueva Ubicación</h3>
        <input
          type="number"
          value={newLocation.id_location}
          onChange={(e) => setNewLocation({ ...newLocation, id_location: e.target.value })}
          placeholder="ID de Localización"
          className="event-locations-input"
        />
        <input
          type="text"
          value={newLocation.name}
          onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
          placeholder="Nombre de la Ubicación"
          className="event-locations-input"
        />
        <input
          type="text"
          value={newLocation.full_address}
          onChange={(e) => setNewLocation({ ...newLocation, full_address: e.target.value })}
          placeholder="Dirección Completa"
          className="event-locations-input"
        />
        <input
          type="number"
          value={newLocation.max_capacity}
          onChange={(e) => setNewLocation({ ...newLocation, max_capacity: e.target.value })}
          placeholder="Capacidad Máxima"
          className="event-locations-input"
        />
        <input
          type="number"
          value={newLocation.latitude}
          onChange={(e) => setNewLocation({ ...newLocation, latitude: e.target.value })}
          placeholder="Latitud"
          className="event-locations-input"
        />
        <input
          type="number"
          value={newLocation.longitude}
          onChange={(e) => setNewLocation({ ...newLocation, longitude: e.target.value })}
          placeholder="Longitud"
          className="event-locations-input"
        />
        <button className="event-locations-add-button" onClick={handleAddLocation}>Agregar</button>
      </div>
    </div>
  );
}

export default EventLocations;