import { jwtDecode } from 'jwt-decode';

export interface LoginResponse {
  userId: string;
  firstName: string;
  lastName: string;
  roles: string;
  token: string;
  exp: number;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch('http://localhost:3000/api/v1/users/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error('Invalid credentials');

  const data = await response.json();

  const payload = jwtDecode<{
    email: string;
    sub: { value: string };
    roles: string;
    exp: number;
  }>(data.access_token);

  const userId = payload.sub?.value;
  if (!userId) throw new Error('Invalid user ID');

  const userResponse = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.access_token}`,
    },
  });

  if (!userResponse.ok) throw new Error('Failed to fetch user data');

  const userDataApi = await userResponse.json();

  return {
    userId,
    firstName: userDataApi.firstName,
    lastName: userDataApi.lastName,
    roles: payload.roles,
    token: data.access_token,
    exp: payload.exp,
  };
}
