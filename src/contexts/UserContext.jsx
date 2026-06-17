import { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { AuthContext } from './AuthContext';
import { getUserById } from '../services/userService';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, updateUser } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  const refreshUser = useCallback(async () => {
    if (!user?.id) return null;
    setRefreshing(true);
    try {
      const { data } = await getUserById(user.id);
      updateUser(data);
      return data;
    } catch {
      return user;
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, updateUser]);

  useEffect(() => {
    if (user?.id && user.perfil === 'user') {
      refreshUser();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || user.perfil !== 'user') return;

    const handleFocus = () => refreshUser();
    const interval = setInterval(refreshUser, 15000);

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [user?.id, user?.perfil, refreshUser]);

  return (
    <UserContext.Provider value={{ refreshUser, refreshing }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
