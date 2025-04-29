import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login as loginAction, logout as logoutAction } from '../store/slices/authSlice';
import { User } from '../lib/types/user.types';

/**
 * Custom hook for authentication that provides Redux state and actions
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const login = useCallback(
    (userData: User) => {
      dispatch(loginAction(userData));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
}
