export interface Message {
    id: number;
    user_id: number; // Foreign key to the User model
    username: string;
    content: string;
    timestamp: Date;
  }
  