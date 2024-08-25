import { query } from '../db';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

export class UserService {
  async registerUser(fullname: string, phoneno: string, city: string, password: string, email: string, country: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (fullname, phoneno, city, password, email, country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [fullname, phoneno, city, hashedPassword, email, country]
    );
    return result.rows[0];
  }

  async authenticateUserByPhone(phoneno: string, password: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE phoneno = $1', [phoneno]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async getUserById(id: number): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async getUserByPhone(phoneno: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE phoneno = $1', [phoneno]);
    return result.rows[0] || null;
  }
}
