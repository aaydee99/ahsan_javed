import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.SUPABASE_DB_USER,
  host: process.env.SUPABASE_DB_HOST,
  database: process.env.SUPBASE_DB_NAME,
  password: process.env.SUPABASE_DB_PASSWORD,
  port: Number(process.env.SUPABASE_PORT),
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
