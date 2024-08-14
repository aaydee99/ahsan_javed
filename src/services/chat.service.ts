import { query } from '../db';
import { Message } from '../models/chat.model';

export class ChatService {
  async saveMessage(userId: number, username: string, content: string): Promise<Message> {
    const result = await query(
      'INSERT INTO messages (user_id, username, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, username, content]
    );
    return result.rows[0];
  }

  async getMessages(): Promise<Message[]> {
    const result = await query('SELECT * FROM messages ORDER BY timestamp ASC');
    return result.rows;
  }

  async getMessageById(id: number): Promise<Message | null> {
    const result = await query('SELECT * FROM messages WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async updateMessage(id: number, userId: number, content: string): Promise<Message | null> {
    const result = await query(
      'UPDATE messages SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [content, id, userId]
    );
    return result.rows[0] || null;
  }

  async deleteMessage(id: number, userId: number): Promise<void> {
    await query('DELETE FROM messages WHERE id = $1 AND user_id = $2', [id, userId]);
  }

  async searchMessages(queryString: string): Promise<Message[]> {
    const result = await query(
      'SELECT * FROM messages WHERE content ILIKE $1 ORDER BY timestamp ASC',
      [`%${queryString}%`]
    );
    return result.rows;
  }

  async getMessageCount(): Promise<number> {
    const result = await query('SELECT COUNT(*) FROM messages');
    return parseInt(result.rows[0].count, 10);
  }

  async getUserActivity(userId: number): Promise<Message[]> {
    const result = await query('SELECT * FROM messages WHERE user_id = $1 ORDER BY timestamp ASC', [userId]);
    return result.rows;
  }
}
