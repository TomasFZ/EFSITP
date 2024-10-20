import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId')); // Almacena el userId


  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    if (storedUsername && token) {
      setUser(storedUsername);
      setUserId(storedUserId);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/user/login', { username, password });
      const userIdResponse = await axios.get(`http://localhost:3001/api/user/getUserID`, { params: { username } });

      if (response.data && response.data.includes('Token:')) {
        const newToken = response.data.split('Token: ')[1];
        const userId1 = userIdResponse.data.split("userId: ")[1];
        setToken(newToken); 
        setUser(username);
        setUserId(userId1); 
        localStorage.setItem('token', newToken); 
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId1); 
        return { success: true, message: 'Login exitoso' };
      } else {
        return { success: false, message: 'Error en el login. Por favor, verifica tus credenciales.' };
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      return { success: false, message: error.response?.data || 'Error en el login. Por favor, intenta de nuevo.' };
    }
  };

  const handleRegister = async (formData) => {
    try {
      const response = await axios.post('http://localhost:3001/api/user/register', formData);
      if (response.status === 201) {
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
    setUserId(null);
    setToken(null);
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  const value = {
    user,
    userId, 
    token,
    login,
    handleRegister,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
