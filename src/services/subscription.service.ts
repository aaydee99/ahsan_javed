import { query } from '../db';
import { Subscription } from '../models/subscription.model';

export class SubscriptionService {
  async createSubscription(userId: number, plan: string, price: number): Promise<Subscription> {
    const result = await query(
      'INSERT INTO subscriptions (user_id, plan, price) VALUES ($1, $2, $3) RETURNING *',
      [userId, plan, price]
    );
    return result.rows[0];
  }

  async getAllSubscriptions(userId: number): Promise<Subscription[]> {
    const result = await query('SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  }

  async getSubscriptionById(id: number, userId: number): Promise<Subscription | null> {
    const result = await query('SELECT * FROM subscriptions WHERE id = $1 AND user_id = $2', [id, userId]);
    return result.rows[0] || null;
  }

  async updateSubscription(id: number, userId: number, plan: string, price: number): Promise<Subscription | null> {
    const result = await query(
      'UPDATE subscriptions SET plan = $1, price = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [plan, price, id, userId]
    );
    return result.rows[0] || null;
  }

  async deleteSubscription(id: number, userId: number): Promise<void> {
    await query('DELETE FROM subscriptions WHERE id = $1 AND user_id = $2', [id, userId]);
  }

  async filterSubscriptionsByPlan(userId: number, plan: string): Promise<Subscription[]> {
    const result = await query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND plan = $2 ORDER BY created_at DESC',
      [userId, plan]
    );
    return result.rows;
  }

  async getTotalRevenue(userId: number): Promise<number> {
    const result = await query(
      'SELECT SUM(price) as total_revenue FROM subscriptions WHERE user_id = $1',
      [userId]
    );
    return parseFloat(result.rows[0].total_revenue);
  }

  async getUserSubscriptionSummary(userId: number): Promise<any> {
    const result = await query(
      'SELECT COUNT(*) as total_subscriptions, SUM(price) as total_spent FROM subscriptions WHERE user_id = $1',
      [userId]
    );

    const activeResult = await query(
      'SELECT COUNT(*) as active_subscriptions FROM subscriptions WHERE user_id = $1 AND plan != $2',
      [userId, 'Cancelled']
    );

    return {
      user_id: userId,
      total_subscriptions: parseInt(result.rows[0].total_subscriptions, 10),
      active_subscriptions: parseInt(activeResult.rows[0].active_subscriptions, 10),
      total_spent: parseFloat(result.rows[0].total_spent),
    };
  }
}
