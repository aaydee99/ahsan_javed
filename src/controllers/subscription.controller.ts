import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { parse } from 'json2csv';

const subscriptionService = new SubscriptionService();

export const createSubscription = async (req: Request, res: Response) => {
  const { plan, price } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const subscription = await subscriptionService.createSubscription(userId, plan, price);
    res.status(201).json(subscription);
  } catch (err) {
    console.error('Error creating subscription:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const subscriptions = await subscriptionService.getAllSubscriptions(userId);
    res.status(200).json(subscriptions);
  } catch (err) {
    console.error('Error fetching subscriptions:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSubscriptionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const subscription = await subscriptionService.getSubscriptionById(Number(id), userId);
    if (subscription) {
      res.status(200).json(subscription);
    } else {
      res.status(404).json({ message: 'Subscription not found or not authorized' });
    }
  } catch (err) {
    console.error('Error fetching subscription:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { plan, price } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const subscription = await subscriptionService.updateSubscription(Number(id), userId, plan, price);
    if (subscription) {
      res.status(200).json(subscription);
    } else {
      res.status(404).json({ message: 'Subscription not found or not authorized' });
    }
  } catch (err) {
    console.error('Error updating subscription:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteSubscription = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await subscriptionService.deleteSubscription(Number(id), userId);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting subscription:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const filterSubscriptionsByPlan = async (req: Request, res: Response) => {
  const { plan } = req.query;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const subscriptions = await subscriptionService.filterSubscriptionsByPlan(userId, plan as string);
    res.status(200).json(subscriptions);
  } catch (err) {
    console.error('Error filtering subscriptions:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTotalRevenue = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const totalRevenue = await subscriptionService.getTotalRevenue(userId);
    res.status(200).json({ total_revenue: totalRevenue });
  } catch (err) {
    console.error('Error calculating total revenue:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserSubscriptionSummary = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const summary = await subscriptionService.getUserSubscriptionSummary(userId);
    res.status(200).json(summary);
  } catch (err) {
    console.error('Error fetching user subscription summary:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const exportSubscriptions = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const subscriptions = await subscriptionService.getAllSubscriptions(userId);
    const csv = parse(subscriptions, { fields: ['id', 'user_id', 'plan', 'price', 'created_at'] });
    res.header('Content-Type', 'text/csv');
    res.attachment('subscriptions.csv');
    return res.send(csv);
  } catch (err) {
    console.error('Error exporting subscriptions:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
