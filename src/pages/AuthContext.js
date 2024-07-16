import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    accessToken: localStorage.getItem('accessToken') || null,
    user: null
  });

  const login = (userData) => {
    console.log(userData)
    setAuthState(userData);
    localStorage.setItem('accessToken', userData.accessToken);
    resetTimer(); 
  };

  const logout = () => {
    setAuthState({
      accessToken: null,
    });
    localStorage.removeItem('accessToken');
  };

  const resetTimer = () => {
    localStorage.setItem('timeLeft', 3600);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, resetTimer}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
