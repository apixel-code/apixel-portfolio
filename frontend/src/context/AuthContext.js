import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('apixel_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('apixel_token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, { email, password });
    const { access_token } = response.data;
    localStorage.setItem('apixel_token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    setToken(access_token);
    setIsAuthenticated(true);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('apixel_token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
