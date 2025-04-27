export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  age?: string;
  showAge?: boolean;
  showEmail?: boolean;
  followersCount: number;
  followingCount: number;
}
