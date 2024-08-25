export interface User {
  id: number;
  fullname: string;
  username: string;
  phoneno: string;
  city?: string;
  password: string; // Passwords should be hashed
  email: string;
  country?: string;
  created_at: Date;
}
