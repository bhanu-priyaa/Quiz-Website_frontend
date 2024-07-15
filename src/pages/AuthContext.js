import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    accessToken: localStorage.getItem('accessToken') || null,
  });

  const login = (token) => {
    setAuthState({
      accessToken: token,
    });
    localStorage.setItem('accessToken', token);
  };

  const logout = () => {
    setAuthState({
      accessToken: null,
    });
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
