export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  birthDate?: string;
  showAge?: boolean;
  showEmail?: boolean;
  followersCount: number;
  followingCount: number;
}
