export const getStoredUser = (): { firstName: string; lastName: string; exp?: number } | null => {
  const user = localStorage.getItem('user');
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const isTokenValid = (): boolean => {
  const user = getStoredUser();
  const exp = user?.exp;
  if (!exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return exp > currentTime;
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
