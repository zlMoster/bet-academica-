import { createContext, useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(StorageService.getUser());
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    StorageService.setUser(userData);
  };

  const logout = () => {
    setUser(null);
    StorageService.removeUser();
  };

  const updateUser = (userData) => {
    setUser(userData);
    StorageService.setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
