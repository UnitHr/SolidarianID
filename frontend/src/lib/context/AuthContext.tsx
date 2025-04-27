import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { apolloClient } from '../apolloClient';

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  roles: string;
  exp: number;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      const currentTime = Math.floor(Date.now() / 1000);
      if (parsedUser.exp && parsedUser.exp > currentTime) {
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        clearAuthData();
      }
    }
  }, []);

  const login = (userData: User) => {
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);

    Cookies.set('user', JSON.stringify(userData), {
      expires: expirationTime,
      path: '/',
      SameSite: 'None',
      Secure: true,
    });

    Cookies.set('token', userData.token, {
      expires: expirationTime,
      path: '/',
      SameSite: 'None',
      Secure: true,
    });
    Cookies.set(isAuthenticated.toString(), 'true', {
      expires: expirationTime,
      path: '/',
      SameSite: 'None',
      Secure: true,
    });

    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    apolloClient.resetStore().catch((err) => {
      console.error('Error resetting Apollo cache during logout:', err);
    });

    clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
  };

  const clearAuthData = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    Cookies.remove('user');
    Cookies.remove('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
