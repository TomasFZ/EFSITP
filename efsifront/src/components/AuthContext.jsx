import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId')); // Almacena el userId

  // Efecto para establecer el usuario y el userId si ya hay un token almacenado
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId'); // Recuperar el userId
    if (storedUsername && token) {
      setUser(storedUsername);
      setUserId(storedUserId); // Establecer el userId
    }
  }, [token]);

  // Función de login
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/user/login', { username, password });

      if (response.data && response.data.includes('Token:')) {
        const newToken = response.data.split('Token: ')[1];
        console.log("LA RESPONSE.DATA ES: " +response.data)
        const newUserId = response.data.userId; // Asegúrate de que el userId esté en la respuesta
        console.log("NEW USER ID "+newUserId)
        setToken(newToken);
        setUser(username);
        setUserId(newUserId); // Establecer el userId en el estado
        localStorage.setItem('token', newToken);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', newUserId); // Almacenar el userId
        return { success: true, message: 'Login exitoso' };
      } else {
        return { success: false, message: 'Error en el login. Por favor, verifica tus credenciales.' };
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      return { success: false, message: error.response?.data || 'Error en el login. Por favor, intenta de nuevo.' };
    }
  };

  // Función de registro, que llama al login tras el registro exitoso
  const handleRegister = async (formData) => {
    try {
      const response = await axios.post('http://localhost:3001/api/user/register', formData);

      if (response.status === 201) {
        // Registro exitoso, iniciamos sesión automáticamente
        await login(formData.username, formData.password);
        return { success: true, message: 'Registro exitoso' };
      } else {
        return { success: false, message: response.data };
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      return { success: false, message: error.response?.data || 'Error en el registro. Por favor, intenta de nuevo.' };
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    setUserId(null); // Limpiar el userId
    setToken(null);
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Eliminar el userId
  };

  // Valor proporcionado por el contexto
  const value = {
    user,
    userId, // Agregar userId al valor del contexto
    token,
    login,
    handleRegister,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
