import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('uop_medical_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('uop_medical_token');
      const savedUser = localStorage.getItem('uop_medical_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        } catch (e) {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const res = await authService.login(username, password);
    const data = res.data;
    
    localStorage.setItem('uop_medical_token', data.access_token);
    const userData = {
      username: data.username,
      fullName: data.full_name,
      role: data.role,
      userId: data.user_id,
    };
    localStorage.setItem('uop_medical_user', JSON.stringify(userData));
    
    setToken(data.access_token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('uop_medical_token');
    localStorage.removeItem('uop_medical_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
