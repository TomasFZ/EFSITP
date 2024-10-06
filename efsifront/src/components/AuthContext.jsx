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

  // Efecto para establecer el usuario si ya hay un token almacenado
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && token) {
      setUser(storedUsername);
    }
  }, [token]);

  // Función de login
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/user/login', { username, password });

      if (response.data && response.data.includes('Token:')) {
        const newToken = response.data.split('Token: ')[1];
        setToken(newToken);
        setUser(username);
        localStorage.setItem('token', newToken);
        localStorage.setItem('username', username);
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
    setToken(null);
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  };

  // Valor proporcionado por el contexto
  const value = {
    user,
    token,
    login,
    handleRegister,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
