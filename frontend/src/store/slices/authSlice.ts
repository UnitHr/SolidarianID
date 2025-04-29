import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { apolloClient } from '../../lib/apolloClient';
import { User } from '../../lib/types/user.types';

// Define the auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login action
    login: (state, action: PayloadAction<User>) => {
      const userData = action.payload;
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);

      // Store user data in cookies -- for cross-domain authentication (Next.js frontend)
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

      // Update state
      state.user = userData;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      // Reset Apollo store
      apolloClient.resetStore().catch((err) => {
        console.error('Error resetting Apollo cache during logout:', err);
      });

      // Clear stored data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      Cookies.remove('user');
      Cookies.remove('token');

      // Reset state
      state.user = null;
      state.isAuthenticated = false;
    },

    // Initialize auth state from stored data
    initializeAuth: (state) => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        const currentTime = Math.floor(Date.now() / 1000);
        if (parsedUser.exp && parsedUser.exp > currentTime) {
          state.user = parsedUser;
          state.isAuthenticated = true;
        } else {
          // Clear expired tokens
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          Cookies.remove('user');
          Cookies.remove('token');
        }
      }
    },
  },
});

export const { login, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
