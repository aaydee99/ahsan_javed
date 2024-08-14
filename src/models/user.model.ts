export interface User {
    id: number;
    username: string;
    password: string; // In a real application, you would hash passwords
    created_at: Date;
  }
  