export interface Subscription {
  id: number;
  user_id: number; // Foreign key to the User model
  plan: string;
  price: number;
  created_at: Date;
}
