export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  roles: string;
  token: string;
  exp: number;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  birthDate: string | Date;
  bio: string;
  showAge: boolean;
  showEmail: boolean;
  githubId?: string | null;
}
