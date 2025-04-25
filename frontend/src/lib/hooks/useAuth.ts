import { useState, useEffect } from 'react';
import { getStoredUser, isTokenValid, clearAuthData } from '../helpers/authUtils';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = getStoredUser();

    if (token && user && isTokenValid()) {
      const fullName = `${user.firstName} ${user.lastName}`;
      setUsername(fullName);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUsername('');
      clearAuthData();
    }
  }, []);

  const logout = () => {
    clearAuthData();
    setIsAuthenticated(false);
    setUsername('');
  };

  return { isAuthenticated, username, logout };
}
