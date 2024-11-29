import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EventCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", display_order: "" });
  const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local.

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/event-category', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.collection);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const { name, display_order } = newCategory;

      // Validaciones previas al envío
      if (!name || name.length < 3) {
        alert("El nombre de la categoría debe tener al menos 3 caracteres.");
        return;
      }
      if (!display_order || isNaN(display_order)) {
        alert("El orden de visualización debe ser un número.");
        return;
      }

      await axios.post(
        'http://localhost:3001/api/event-category',
        { name, display_order: Number(display_order) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewCategory({ name: "", display_order: "" });
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/event-category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="event-categories-container">
      <h2 className="event-categories-title">Administrar Categorías</h2>
      <ul className="event-categories-list">
        {categories.map(category => (
          <li key={category.id} className="event-categories-item">
            {category.name} (Orden: {category.display_order})
            <button onClick={() => handleDeleteCategory(category.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newCategory.name}
        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        placeholder="Nueva Categoría"
        className="event-categories-input"
      />
      <input
        type="number"
        value={newCategory.display_order}
        onChange={(e) => setNewCategory({ ...newCategory, display_order: e.target.value })}
        placeholder="Orden de Visualización"
        className="event-categories-input"
      />
      <button onClick={handleAddCategory} className="event-categories-add-button">Agregar</button>
    </div>
  );
}

export default EventCategories;
